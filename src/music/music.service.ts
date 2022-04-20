import { parseFile } from 'music-metadata';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Music } from './schemas/music.schema';
import { MusicModule } from './music.module';
import { scan } from './helpers/get-files-in-dir';
import { staticFolderName } from './../constants/index';
import { musicDtoFromMetadata } from './helpers/dto-from-metadata';
import { PromisePool } from '@supercharge/promise-pool';

@Injectable()
export class MusicService {
  constructor(
    @InjectModel(Music.name) private musicModal: Model<MusicModule>,
  ) {}

  async findAll(userFilterQuery: FilterQuery<Music>, limit = 10, skip = 0) {
    const allMusic = await this.musicModal
      .find(userFilterQuery)
      .limit(limit)
      .skip(skip);
    const total = await this.musicModal.count();
    return {
      music: allMusic,
      meta: { limit, skip, total },
    };
  }

  async findOne(userFilterQuery: FilterQuery<Music>) {
    const music = await this.musicModal.findOne(userFilterQuery);
    if (!music) throw new NotFoundException();
    return music;
  }

  async clean(filesName?: string[], allMusic?: Music[]) {
    if (!filesName) filesName = await scan(staticFolderName);
    if (!allMusic) allMusic = await this.musicModal.find({}, { path: 1 });
    const shouldRemove = allMusic.reduce(
      (arr, cur) => (filesName.includes(cur.path) ? arr : [...arr, cur.path]),
      [],
    );

    const bulkRemoveState = await this.bulkRemove(shouldRemove);
    return { bulkRemoveState, shouldRemove };
  }

  async sync(method: string) {
    const paths = await scan(staticFolderName);
    const allMusic: Music[] = await this.musicModal.find({}, { path: 1 });
    await this.clean(paths);
    const dbPaths = allMusic.map(({ path }) => path);
    const upsertPaths =
      method === 'reload'
        ? paths
        : paths.filter((path) => !dbPaths.includes(path));

    const concurrency = 100;
    const formOperation = async (path: string) => {
      try {
        const metadata = await parseFile(path);
        const dto = await musicDtoFromMetadata(path, metadata);
        return {
          updateOne: {
            filter: { path },
            update: { ...dto, $setOnInsert: { musicId: uuidv4() } },
            upsert: true,
          },
        };
      } catch (e) {
        return null;
      }
    };
    const { results } = await PromisePool.withConcurrency(concurrency)
      .for(upsertPaths)
      .process(formOperation);

    const operations = results.filter((exist) => exist);
    if (operations.length > 0) {
      const upsertState = await this.musicModal.bulkWrite(operations);
      return upsertState;
    }
    return { OK: 1, update: 0 };
  }

  async bulkRemove(paths: string[]) {
    return await this.musicModal.deleteMany({ path: { $in: paths } });
  }
}

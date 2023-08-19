import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { join } from 'path';
import { PromisePool } from '@supercharge/promise-pool';
import { parseFile } from 'music-metadata';
import { v4 as uuidv4 } from 'uuid';
import { staticFolderName } from '@/constants';
import { Music, MusicDocument } from './schemas/music.schema';
import { MusicModule } from './music.module';
import { scan } from './helpers/get-files-in-dir';
import { musicFromMetadata } from './helpers/music-factory';

@Injectable()
export class MusicService {
  constructor(
    @InjectModel(Music.name) private musicModal: Model<MusicModule>,
  ) {}

  async findAll(
    userFilterQuery: FilterQuery<Music>,
    limit: number,
    skip: number,
  ) {
    const [musicDocs, total] = await Promise.all([
      userFilterQuery.$text
        ? this.musicModal
            .find(userFilterQuery, { covers: 0, score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .skip(skip)
        : this.musicModal
            .find(userFilterQuery, { covers: 0 })
            .limit(limit)
            .skip(skip),
      this.musicModal.count(userFilterQuery),
    ]);
    return {
      musicDocs,
      meta: { limit, skip, total },
    };
  }

  async findOne(userFilterQuery: FilterQuery<Music>): Promise<MusicDocument> {
    const musicDoc = await this.musicModal.findOne(userFilterQuery);
    if (!musicDoc) throw new NotFoundException();
    return musicDoc;
  }

  async clean(filesName?: string[], allMusic?: Music[]) {
    if (!filesName) filesName = await scan(join(staticFolderName));
    if (!allMusic) allMusic = await this.musicModal.find({}, { path: 1 });
    const shouldDelete = allMusic.reduce(
      (arr, cur) => (filesName.includes(cur.path) ? arr : [...arr, cur.path]),
      [],
    );

    const bulkDeleteState = await this.bulkDelete(shouldDelete);
    return { bulkDeleteState, deleted: shouldDelete };
  }

  async sync(method: string) {
    const paths = await scan(join(staticFolderName));
    const allMusic: Music[] = await this.musicModal.find({}, { path: 1 });
    await this.clean(paths);
    const dbPaths = allMusic.map(({ path }) => path);
    const upsertPaths =
      method === 'reload'
        ? paths
        : paths.filter((path) => !dbPaths.includes(path));
    const formOperation = async (path: string) => {
      try {
        const metadata = await parseFile(join(process.cwd(), path));
        const dto = await musicFromMetadata(path, metadata);
        return {
          updateOne: {
            filter: { path },
            update: { ...dto, $setOnInsert: { musicId: uuidv4() } },
            upsert: true,
          },
        };
      } catch (e) {
        // Logger.log(e);
        return null;
      }
    };
    const { results: operations } = await PromisePool.withConcurrency(100)
      .for(upsertPaths)
      .process(formOperation);
    const validOperations = operations.filter((exist) => exist);
    if (validOperations.length > 0) {
      const upsertState = await this.musicModal.bulkWrite(validOperations);
      return upsertState;
    }
    return { ok: 1, upserted: [] };
  }

  bulkDelete(paths: string[]) {
    return this.musicModal.deleteMany({ path: { $in: paths } });
  }
}

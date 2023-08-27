import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';
import { lookup, extension } from 'mime-types';
import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  StreamableFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
  NotFoundException,
  Response,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AllMusicDto,
  MusicDetailParams,
  MusicListResponse,
  SyncMusicDto,
  SyncMusicResponse,
} from './dto';
import { CleanMusicResponse } from './dto/clean-music.dto';
import { musicFromDoc } from './helpers/music-factory';
import { MusicService } from './music.service';
import { Music } from './schemas/music.schema';
import { Response as ExpressResponse } from 'express';

@ApiTags('Music')
@ApiHeader({ name: 'x-api-key', required: true })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(AuthGuard('api-key'))
@Controller({ path: 'music', version: '1' })
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  @ApiOperation({ summary: 'Music list' })
  @ApiOkResponse({ description: 'List of music', type: MusicListResponse })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() query: AllMusicDto = {}) {
    const { limit = 10, skip = 0, search } = query;
    const filterQuery = search ? { $text: { $search: search } } : {};
    const { musicDocs, meta } = await this.musicService.findAll(
      filterQuery,
      limit,
      skip,
    );
    console.log(JSON.stringify(musicDocs, null, 2));
    return {
      data: musicDocs.map((doc) => {
        const music = musicFromDoc(doc);
        return {
          ...music,
          url: `/download/${music.musicId}.${music.ext.toLowerCase()}`,
          thumbnail: `/${music.musicId}/thumbnail`,
        };
      }),
      meta,
    };
  }

  @Post('/sync')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sync Music' })
  @ApiOkResponse({ description: 'Music synced', type: SyncMusicResponse })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  sync(@Body() body: SyncMusicDto) {
    const { method } = body;
    return this.musicService.sync(method);
  }

  @Delete('/clean')
  @ApiOperation({ summary: 'Clean Music' })
  @ApiOkResponse({ description: 'Music cleaned', type: CleanMusicResponse })
  clean() {
    return this.musicService.clean();
  }

  @Get('/download/:musicId.:ext')
  @ApiOperation({ summary: 'Download music' })
  @ApiOkResponse({ description: 'Download music', type: Music })
  @ApiNotFoundResponse({ description: 'Music not found' })
  @ApiBadRequestResponse({ description: 'musicId must be uuid' })
  async download(
    @Param() params: MusicDetailParams,
    // @Headers() headers,
    // @Response({ passthrough: true }) res: ExpressResponse,
  ): Promise<any> {
    const { musicId, ext } = params;
    console.log(musicId, ext);
    // const range = headers.range;
    const filterQuery = { musicId };
    const musicDoc = await this.musicService.findOne(filterQuery);
    console.log(musicDoc.path);
    const fileState = await stat(join(process.cwd(), musicDoc.path));
    const contentType = lookup(musicDoc.filename);
    const fileExt = musicDoc.ext ?? extension(musicDoc.filename);

    if (ext !== fileExt) throw new NotFoundException('Music ext not found');

    if (fileExt && contentType) {
      const filename = `${musicDoc.musicId}.${fileExt}`;
      // if (range) {
      //   const rangeBytes = range.split('=')[1].split('-');
      //   const start = Number(rangeBytes[0]);
      //   const end = Math.min(Number(rangeBytes[1]), fileState.size - 1);
      //   const contentLength = end - start + 1;
      //   const resHeaders = {
      //     'Accept-Ranges': 'bytes',
      //     'Content-Range': `bytes ${start}-${end}/${fileState.size}`,
      //     'Content-Disposition': `attachment; filename="${filename}"`,
      //     'Content-Length': contentLength,
      //     'Content-Type': contentType,
      //   };
      //   try {
      //     res.writeHead(HttpStatus.PARTIAL_CONTENT, resHeaders);
      //     const stream = createReadStream(join(process.cwd(), musicDoc.path), {
      //       start,
      //       end,
      //     });

      //     return new StreamableFile(stream);
      //   } catch (err) {
      //     console.log(err && err.message);
      //     return;
      //   }
      // } else {
      const stream = createReadStream(join(process.cwd(), musicDoc.path));
      return new StreamableFile(stream, {
        disposition: `attachment; filename="${filename}"`,
        length: fileState.size,
        type: contentType,
      });
      // }
    }

    throw new InternalServerErrorException('Music file process error.');
  }

  @Get(':musicId')
  @ApiOperation({ summary: 'Music detail' })
  @ApiOkResponse({ description: 'Music detail', type: Music })
  @ApiNotFoundResponse({ description: 'Music not found' })
  @ApiBadRequestResponse({ description: 'musicId must be uuid' })
  async findOne(
    @Param() params: MusicDetailParams,
  ): Promise<Music & { url: string }> {
    const { musicId } = params;
    const filterQuery = { musicId };
    const musicDoc = await this.musicService.findOne(filterQuery);
    const music = musicFromDoc(musicDoc);
    return {
      ...music,
      url: `/download/${music.musicId}.${music.ext.toLowerCase()}`,
    };
  }

  @Get(':musicId/cover')
  @ApiOperation({ summary: 'Music Cover' })
  @ApiOkResponse({ description: 'Music Cover' })
  @ApiNotFoundResponse({ description: 'Cover not found' })
  @ApiBadRequestResponse({ description: 'musicId must be uuid' })
  async findCover(
    @Response() res: ExpressResponse,
    @Param() params: MusicDetailParams,
  ) {
    const { musicId } = params;
    const filterQuery = { musicId };
    const musicDoc = await this.musicService.findOne(filterQuery);
    const img = musicDoc.covers?.[0].thumbnail;
    const imgFormat = musicDoc.covers?.[0].format;
    if (!img || !imgFormat) throw new NotFoundException('Cover Not Found');
    res.setHeader('Content-Type', imgFormat);
    return res.send(Buffer.from(img, 'base64'));
  }

  @Get(':musicId/thumbnail')
  @ApiOperation({ summary: 'Music Thumbnail' })
  @ApiOkResponse({ description: 'Music Thumbnail' })
  @ApiNotFoundResponse({ description: 'Thumbnail not found' })
  @ApiBadRequestResponse({ description: 'musicId must be uuid' })
  async findThumbnail(
    @Response() res: ExpressResponse,
    @Param() params: MusicDetailParams,
  ) {
    const { musicId } = params;
    const filterQuery = { musicId };
    const musicDoc = await this.musicService.findOne(filterQuery);
    const img = musicDoc.covers?.[0].thumbnail;
    const imgFormat = musicDoc.covers?.[0].format;
    if (!img || !imgFormat) throw new NotFoundException('Thumbnail Not Found');
    res.setHeader('Content-Type', imgFormat);
    return res.send(Buffer.from(img, 'base64'));
  }
}

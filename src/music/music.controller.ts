import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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
  MusicDetailDto,
  MusicListResponse,
  SyncMusicDto,
  SyncMusicResponse,
} from './dto';
import { CleanMusicResponse } from './dto/clean-music.dto';
import { musicFromDoc } from './helpers/music-factory';
import { MusicService } from './music.service';
import { Music } from './schemas/music.schema';

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
  async findAll(@Query() qs: AllMusicDto = {}) {
    const { limit = 10, skip = 0 } = qs;
    const filterQuery = {};
    const { musicDocs, meta } = await this.musicService.findAll(
      filterQuery,
      limit,
      skip,
    );
    return { data: musicDocs.map(musicFromDoc), meta };
  }

  @Get(':musicId')
  @ApiOperation({ summary: 'Music detail' })
  @ApiOkResponse({ description: 'Music detail', type: Music })
  @ApiNotFoundResponse({ description: 'Music not found' })
  @ApiBadRequestResponse({ description: 'musicId must be uuid' })
  async findOne(@Param() params: MusicDetailDto): Promise<Music> {
    const { musicId } = params;
    const filterQuery = { musicId };
    const musicDoc = await this.musicService.findOne(filterQuery);
    return musicFromDoc(musicDoc);
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
}

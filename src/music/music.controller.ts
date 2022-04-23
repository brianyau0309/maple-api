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
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllMusicDto, MusicDetailDto, SyncMusicDto } from './dto';
import { MusicService } from './music.service';

@ApiTags('Music')
@ApiHeader({ name: 'x-api-key', required: true })
@Controller({ path: 'music', version: '1' })
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  @UseGuards(AuthGuard('api-key'))
  @ApiOperation({ summary: 'Music list' })
  findAll(@Query() qs: AllMusicDto = {}) {
    const { limit = 10, skip = 0 } = qs;
    const filterQuery = {};
    return this.musicService.findAll(filterQuery, limit, skip);
  }

  @Get(':musicId')
  @ApiOperation({ summary: 'Music detail' })
  findOne(@Param() params: MusicDetailDto) {
    const { musicId } = params;
    const filterQuery = { musicId };
    return this.musicService.findOne(filterQuery);
  }

  @Post('/sync')
  @HttpCode(200)
  @ApiOperation({ summary: 'Sync Music' })
  sync(@Body() body: SyncMusicDto) {
    const { method } = body;
    return this.musicService.sync(method);
  }

  @Delete('/clean')
  @ApiOperation({ summary: 'Clean Music' })
  clean() {
    return this.musicService.clean();
  }
}

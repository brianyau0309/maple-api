import { Controller, Get, Param, Query } from '@nestjs/common';
import { MusicService } from './music.service';

@Controller({ path: 'music', version: '1' })
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  findAll(@Query('limit') limit: number, @Query('skip') skip: number) {
    const filterQuery = {};
    return this.musicService.findAll(filterQuery, limit, skip);
  }

  @Get(':musicId')
  findOne(@Param('musicId') musicId: string) {
    const filterQuery = { musicId };
    return this.musicService.findOne(filterQuery);
  }

  @Get('/sync')
  sync(@Query('method') method: string) {
    return this.musicService.sync(method);
  }

  @Get('/clean')
  clean() {
    return this.musicService.clean();
  }
}

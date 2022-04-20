import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { Music, MusicSchema } from './schemas/music.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Music.name, schema: MusicSchema }]),
  ],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}

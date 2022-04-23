import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Music } from '../schemas/music.schema';

export class AllMusicDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  skip?: number;
}

export class MusicListMeta {
  @IsNumber()
  @ApiProperty()
  limit: number;

  @IsNumber()
  @ApiProperty()
  skip: number;

  @IsNumber()
  @ApiProperty()
  total: number;
}

export class MusicListResponse {
  @ApiProperty({ description: 'Music list', type: Music, isArray: true })
  data: Music[];

  @ApiProperty({ description: 'Metadata' })
  meta: MusicListMeta;
}

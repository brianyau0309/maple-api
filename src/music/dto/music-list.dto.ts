import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { Music } from '../schemas/music.schema';

export class AllMusicDto {
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  skip?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  search?: string;
}

export class MusicListMeta {
  @IsInt()
  @ApiProperty()
  limit: number;

  @IsInt()
  @ApiProperty()
  skip: number;

  @IsInt()
  @ApiProperty()
  total: number;
}

export class MusicListResponse {
  @ApiProperty({ description: 'Music list', type: Music, isArray: true })
  data: (Music & { url: string })[];

  @ApiProperty({ description: 'Metadata' })
  meta: MusicListMeta;
}

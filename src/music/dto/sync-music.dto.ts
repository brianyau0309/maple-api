import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SyncMusicDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  method?: string;
}

export class SyncMusicResponse {
  @ApiProperty({ type: Number })
  ok: number;
}

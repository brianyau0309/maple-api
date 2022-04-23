import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export default class SyncMusicDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  method?: string;
}

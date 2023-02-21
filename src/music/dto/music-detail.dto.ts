import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MusicDetailParams {
  @IsUUID()
  @ApiProperty()
  musicId: string;

  @ApiProperty()
  ext: string;
}

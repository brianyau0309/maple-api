import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export default class MusicDetailDto {
  @IsUUID()
  @ApiProperty()
  musicId: string;
}

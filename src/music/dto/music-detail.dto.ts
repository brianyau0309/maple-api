import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MusicDetailDto {
  @IsUUID()
  @ApiProperty()
  musicId: string;
}

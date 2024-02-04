import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class MusicDetailParams {
  @IsUUID()
  @ApiProperty()
  musicId: string;

  @ApiProperty()
  ext: string;
}

export class MusicDownloadHeaders {
  @IsString()
  @ApiProperty({ required: false })
  range?: string;
}

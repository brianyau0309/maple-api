import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export default class AllMusicDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  skip?: number;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type MusicCoverDocument = MusicCover & Document;

@Schema()
export class MusicCover {
  @Prop()
  @ApiProperty()
  type: string;

  @Prop({ required: true })
  @ApiProperty()
  format: string;

  @Prop({ required: true })
  @ApiProperty()
  data: string;
}

export const MusicCoverSchema = SchemaFactory.createForClass(MusicCover);

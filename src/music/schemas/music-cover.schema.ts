import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MusicCoverDocument = MusicCover & Document;

@Schema()
export class MusicCover {
  @Prop()
  type: string;

  @Prop({ required: true })
  format: string;

  @Prop({ required: true })
  data: string;
}

export const MusicCoverSchema = SchemaFactory.createForClass(MusicCover);

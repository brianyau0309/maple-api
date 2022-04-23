import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MusicCover } from './music-cover.schema';

export type MusicCoverDocument = MusicCover & Document;

@Schema()
export class Music {
  @Prop({ unique: true })
  musicId?: string;

  @Prop({ unique: true, required: true })
  path: string;

  @Prop()
  filename: string;

  @Prop()
  ext?: string;

  @Prop({ required: true, default: 'untitled' })
  title?: string;

  @Prop()
  artist?: string;

  @Prop()
  album?: string;

  @Prop([MusicCover])
  covers?: MusicCover[];

  @Prop()
  container?: string;

  @Prop()
  codec?: string;

  @Prop()
  lossless?: boolean;

  @Prop()
  numberOfChannels?: number;

  @Prop()
  bitsPerSample?: number;

  @Prop()
  sampleRate?: number;

  @Prop()
  duration?: number;

  @Prop()
  bitrate?: number;
}

export const MusicSchema = SchemaFactory.createForClass(Music);

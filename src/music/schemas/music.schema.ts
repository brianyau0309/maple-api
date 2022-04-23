import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { MusicCover } from './music-cover.schema';

export type MusicDocument = Document & Music;

@Schema()
export class Music {
  @Prop({ unique: true })
  @ApiProperty()
  musicId?: string;

  @Prop({ type: String, unique: true, required: true })
  @ApiProperty()
  path?: string;

  @Prop({ type: String, required: true })
  @ApiProperty()
  filename?: string;

  @Prop({ required: true })
  @ApiProperty({ required: false })
  ext?: string;

  @Prop({ required: true, default: 'untitled' })
  @ApiProperty()
  title?: string;

  @Prop()
  @ApiProperty({ required: false })
  artist?: string;

  @Prop()
  @ApiProperty({ required: false })
  album?: string;

  @Prop([MusicCover])
  @ApiProperty({ type: MusicCover, isArray: true, required: false })
  covers?: MusicCover[];

  @Prop()
  @ApiProperty({ required: false })
  container?: string;

  @Prop()
  @ApiProperty({ required: false })
  codec?: string;

  @Prop()
  @ApiProperty({ required: false })
  @ApiProperty({ type: Boolean, required: false })
  lossless?: boolean;

  @Prop()
  @ApiProperty({ type: Number, required: false })
  numberOfChannels?: number;

  @Prop()
  @ApiProperty({ type: Number, required: false })
  bitsPerSample?: number;

  @Prop()
  @ApiProperty({ type: Number, required: false })
  sampleRate?: number;

  @Prop()
  @ApiProperty({ type: Number, required: false })
  duration?: number;

  @Prop()
  @ApiProperty({ type: Number, required: false })
  bitrate?: number;
}

export const MusicSchema = SchemaFactory.createForClass(Music);

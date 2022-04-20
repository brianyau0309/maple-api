import { MusicCover } from '../schemas/music-cover.schema';

export class CreateMusicDto {
  path: string;
  filename: string;
  ext?: string;
  title?: string;
  artist?: string;
  album?: string;
  covers?: MusicCover[];
  container?: string;
  codec?: string;
  lossless?: boolean;
  numberOfChannels?: number;
  bitsPerSample?: number;
  sampleRate?: number;
  duration?: number;
  bitrate?: number;
}

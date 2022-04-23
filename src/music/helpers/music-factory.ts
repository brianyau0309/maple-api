import { IAudioMetadata, IPicture } from 'music-metadata';
import { basename, extname } from 'path';
import { Music } from '../schemas/music.schema';
import { MusicCover } from '../schemas/music-cover.schema';
import { resizeCover } from './image-process';

const musicCoverFromMetadata = async (
  pictures?: IPicture[],
): Promise<MusicCover[] | undefined> => {
  if (pictures === undefined) return;
  const covers = [];
  for (const picture of pictures) {
    const { type, format, data } = picture;
    const resizedBuffer = await resizeCover(data);
    covers.push({ type, format, data: resizedBuffer.toString('base64') });
  }
  return covers;
};

export const musicFromMetadata = async (
  path: string,
  metadata: IAudioMetadata,
): Promise<Music> => ({
  path,
  filename: basename(path),
  ext: extname(path).replace('.', '') || undefined,
  title: metadata.common.title,
  artist: metadata.common.artist,
  album: metadata.common.album,
  covers: await musicCoverFromMetadata(metadata.common.picture),
  container: metadata.format.container,
  codec: metadata.format.codec,
  lossless: metadata.format.lossless,
  numberOfChannels: metadata.format.numberOfChannels,
  bitsPerSample: metadata.format.bitsPerSample,
  sampleRate: metadata.format.sampleRate,
  duration: metadata.format.duration,
  bitrate: metadata.format.bitrate,
});

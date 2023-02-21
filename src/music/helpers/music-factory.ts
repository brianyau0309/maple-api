import { IAudioMetadata, IPicture } from 'music-metadata';
import { basename, extname } from 'path';
import { Music, MusicDocument } from '../schemas/music.schema';
import { MusicCover } from '../schemas/music-cover.schema';
import { resizeCover } from './image-process';

const musicCoverFromMetadata = async (
  pictures?: IPicture[],
): Promise<MusicCover[] | undefined> => {
  if (pictures === undefined) return;
  const covers = [];
  for (const picture of pictures) {
    const { type, data } = picture;
    const webpBuffer = await resizeCover(data);
    covers.push({
      type,
      format: 'image/webp',
      data: webpBuffer.toString('base64'),
    });
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

export const musicFromDoc = (doc: MusicDocument): Music => ({
  musicId: doc.musicId,
  path: doc.path,
  filename: doc.filename,
  ext: doc.ext,
  title: doc.title,
  artist: doc.artist,
  album: doc.album,
  covers: doc.covers,
  container: doc.container,
  codec: doc.codec,
  lossless: doc.lossless,
  numberOfChannels: doc.numberOfChannels,
  bitsPerSample: doc.bitsPerSample,
  sampleRate: doc.sampleRate,
  duration: doc.duration,
  bitrate: doc.bitrate,
});

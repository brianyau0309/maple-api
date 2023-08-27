import * as sharp from 'sharp';

export const resizeCover = async (imageBuffer: Buffer, width: number) => {
  const resizedBuffer = await sharp(imageBuffer)
    .webp({ lossless: true })
    .resize({ width })
    .toBuffer();
  return resizedBuffer;
};

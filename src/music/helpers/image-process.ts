import * as sharp from 'sharp';

export const resizeCover = async (imageBuffer: Buffer) => {
  const resizedBuffer = await sharp(imageBuffer)
    .webp({ lossless: true })
    .resize({ width: 300 })
    .toBuffer();
  return resizedBuffer;
};

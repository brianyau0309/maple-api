import * as sharp from 'sharp';

export const resizeCover = async (imageBuffer: Buffer) => {
  const resizedBuffer = await sharp(imageBuffer)
    .resize({ width: 150 })
    .toBuffer();
  return resizedBuffer;
};

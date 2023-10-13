import sharp from 'sharp';

export async function resizeImage(
  url: string,
  height: number,
  width: number
) {
  const buffer = await getImageBuffer(url);
  const newBuffer = await sharp(buffer).resize(width, height).toBuffer();
  return newBuffer;
}

async function getImageBuffer(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return buffer;
}
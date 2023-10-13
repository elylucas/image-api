import sharp from 'sharp';

export async function resizeImage(
  urlOrBuffer: string | Buffer,
  height: number,
  width: number
) {
  const buffer = await getBuffer(urlOrBuffer);
  const newBuffer = await sharp(buffer)
    .resize({ width, height, fit: 'fill' })
    .toBuffer();
  return newBuffer;
}

export const cropImage = async (
  urlOrBuffer: string | Buffer,
  top: number,
  left: number,
  height: number,
  width: number
) => {
  const buffer = await getBuffer(urlOrBuffer);
  return await sharp(buffer)
    .extract({
      height,
      width,
      top,
      left,
    })
    .toBuffer();
};

async function getBuffer(urlOrBuffer: string | Buffer) {
  let buffer: Buffer;
  if (typeof urlOrBuffer === 'string') {
    const imageBuffer = await getImageBuffer(urlOrBuffer);
    buffer = Buffer.from(imageBuffer);
  } else {
    buffer = urlOrBuffer;
  }
  return buffer;
}

async function getImageBuffer(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return buffer;
}

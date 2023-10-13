import express from 'express';
import { cropImage, resizeImage } from './imageLib.js';

const router = express.Router();

router.use(validateParams);

router.get('/', async (req, res, next) => {
  const url = req.query.url as string;
  const height = Number(req.query.height as string);
  const width = Number(req.query.width as string);
  const cropTop = Number(req.query.cropTop) || 0;
  const cropLeft = Number(req.query.cropLeft) || 0;
  const cropHeight = Number(req.query.cropHeight) || height;
  const cropWidth = Number(req.query.cropWidth) || width;

  try {
    let imageBuffer = await resizeImage(url, height, width);

    if (cropTop && cropLeft && cropHeight && cropWidth) {
      imageBuffer = await cropImage(
        imageBuffer,
        cropTop,
        cropLeft,
        cropHeight,
        cropWidth
      );
    }

    res.contentType('image/jpeg').send(imageBuffer);
  } catch (error) {
    next(error);
  }
});

function validateParams(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!req.query.url || !req.query.height || !req.query.width) {
    res.status(400).send('Error: url, height and width must be provided');
    return;
  }

  const height = Number(req.query.height as string);
  const width = Number(req.query.width as string);

  if (isNaN(height) || isNaN(width)) {
    res.status(400).send('Error: height and width must be numbers');
    return;
  }

  if (
    req.query.cropTop ||
    req.query.cropLeft ||
    req.query.cropHeight ||
    req.query.cropWidth
  ) {
    if (
      !(
        req.query.cropTop &&
        req.query.cropLeft &&
        req.query.cropHeight &&
        req.query.cropWidth
      )
    ) {
      res
        .status(400)
        .send(
          'Error: cropTop, cropLeft, cropHeight, and cropWidth must be provided together'
        );
      return;
    }
  }

  const cropTop = Number(req.query.cropTop) || 0;
  const cropLeft = Number(req.query.cropLeft) || 0;
  const cropHeight = Number(req.query.cropHeight) || 0;
  const cropWidth = Number(req.query.cropWidth) || 0;

  if (
    isNaN(height) ||
    isNaN(width) ||
    isNaN(cropTop) ||
    isNaN(cropLeft) ||
    isNaN(cropHeight) ||
    isNaN(cropWidth)
  ) {
    res
      .status(400)
      .send('Error: height, width, top, and left must be numbers if provided');
    return;
  }
  next();
}

export const imageController = router;

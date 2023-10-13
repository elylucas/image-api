import express from 'express';
import { resizeImage } from './imageLib.js';

const router = express.Router();

router.use(validateParams);

router.get('/', async (req, res) => {
  const url = req.query.url as string;
  const height = Number(req.query.height as string);
  const width = Number(req.query.width as string);

  const imageBuffer = await resizeImage(url, height, width);

  res.contentType('image/jpeg').send(imageBuffer);
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
  next();
}

export const imageController = router;

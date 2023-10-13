import express from 'express';
import { imageController } from './image.controller.js';

const app = express();
const port = 3000;

app.use('/', imageController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

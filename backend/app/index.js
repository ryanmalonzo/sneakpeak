import express from 'express';
import { UserRouter } from './routers/user';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from './helpers/error';

const app = express();

app.use(express.json());
app.use('/api', UserRouter);

/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof RequestError) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
});

export default app;

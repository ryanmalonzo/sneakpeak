import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from './helpers/error';
import { SessionRouter } from './routers/SessionRouter';
import { SneakerRouter } from './routers/SneakerRouter';
import { UserRouter } from './routers/UserRouter';
import { BrandRouter } from './routers/brand';
import { CategoryRouter } from './routers/category';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://sneakpeak.store'],
    methods: 'GET,POST,PUT',
    allowedHeaders: 'Content-Type,Authorization',
  }),
);
app.use(express.json());
app.use('/', UserRouter);
app.use('/', SessionRouter);
app.use('/', SneakerRouter);
app.use('/', BrandRouter);
app.use('/', CategoryRouter)

/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof RequestError) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
});

export default app;

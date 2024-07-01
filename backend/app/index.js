import cors from 'cors';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from './helpers/error';
import { SessionRouter } from './routers/SessionRouter';
import { SneakerRouter } from './routers/SneakerRouter';
import { UserRouter } from './routers/UserRouter';
import cookieParser from 'cookie-parser';
import { BrandRouter } from './routers/BrandRouter';
import { CategoryRouter } from './routers/CategoryRouter';
import { CartRouter } from './routers/CartRouter';
import { StripeRouter } from './routers/StripeRouter';
import { CheckoutRouter } from './routers/CheckoutRouter';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://sneakpeak.store'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  }),
);
app.use((req, res, next) => {
  if (req.path === '/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

app.use(cookieParser());

app.use('/users', UserRouter);
app.use('/session', SessionRouter);
app.use('/sneakers', SneakerRouter);
app.use('/brands', BrandRouter);
app.use('/categories', CategoryRouter);
app.use('/cart', CartRouter);
app.use('/webhook', StripeRouter);
app.use('/checkout', CheckoutRouter);

/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  if (err instanceof RequestError) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
});

export default app;

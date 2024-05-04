import express from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

router.post('/register', (req, res) => {
  res.sendStatus(StatusCodes.CREATED);
});

export default router;

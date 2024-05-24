import { NextFunction, Request, Response, Router } from 'express';
import { SneakerService } from '../services/sneaker';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../middlewares/auth';

export const SneakerRouter = Router();

// Tous les endpoints de ce router nécessitent un bearer token
SneakerRouter.use(verifyToken);

SneakerRouter.get(
  '/sneakers',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      return res
        .status(StatusCodes.OK)
        .json(await SneakerService.getPaginated(Number(page), Number(limit)));
    } catch (error) {
      next(error);
    }
  },
);

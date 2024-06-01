import { NextFunction, Request, Response, Router } from 'express';
import { SneakerService } from '../services/SneakerService';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';
import { pagination } from '../middlewares/pagination';

export const SneakerRouter = Router();

// Tous les endpoints de ce router nécessitent un bearer token
SneakerRouter.use(auth);

SneakerRouter.use('/', pagination);
SneakerRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, sortOptions, filterOptions } = res.locals;

      return res
        .status(StatusCodes.OK)
        .json(
          await SneakerService.getPaginated(
            page,
            limit,
            sortOptions,
            filterOptions,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
);

import { NextFunction, Request, Response, Router } from 'express';
import { BrandService } from '../services/BrandService';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';
import cookieParser from 'cookie-parser';

export const BrandRouter = Router();

// Tous les endpoints de ce router nécessitent un cookie d'authentification
BrandRouter.use(cookieParser());
BrandRouter.use(auth);

BrandRouter.post(
  '/brands',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.CREATED)
        .json(await BrandService.save(req.body.name, req.body.slug));
    } catch (error) {
      next(error);
    }
  },
);

BrandRouter.put(
  '/brands/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(
          await BrandService.update(
            parseInt(req.params.id),
            req.body.name,
            req.body.slug,
          ),
        );
    } catch (error) {
      next(error);
    }
  },
);

BrandRouter.delete(
  '/brands/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await BrandService.delete(parseInt(req.params.id)));
    } catch (error) {
      next(error);
    }
  },
);

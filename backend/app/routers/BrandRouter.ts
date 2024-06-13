import { NextFunction, Request, Response, Router } from 'express';
import { BrandService } from '../services/BrandService';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';

export const BrandRouter = Router();

BrandRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(StatusCodes.OK).json(await BrandService.findAll());
    } catch (error) {
      next(error);
    }
  },
);

BrandRouter.post(
  '/',
  auth,
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
  '/:id',
  auth,
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
  '/:id',
  auth,
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

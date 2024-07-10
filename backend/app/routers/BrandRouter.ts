import { NextFunction, Request, Response, Router } from 'express';
import { BrandService } from '../services/BrandService';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';
import { admin } from '../middlewares/admin';

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
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.CREATED)
        .json(
          await BrandService.save(req.body.name, req.body.slug, req.body.image),
        );
    } catch (error) {
      next(error);
    }
  },
);

BrandRouter.put(
  '/:id',
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(
          await BrandService.update(
            parseInt(req.params.id),
            req.body.name,
            req.body.slug,
            req.body.image,
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
  admin,
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

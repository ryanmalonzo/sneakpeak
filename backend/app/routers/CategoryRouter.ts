import { NextFunction, Request, Response, Router } from 'express';
import { CategoryService } from '../services/CategoryService';
import { StatusCodes } from 'http-status-codes';
import { auth } from '../middlewares/auth';
import { admin } from '../middlewares/admin';

export const CategoryRouter = Router();

CategoryRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(StatusCodes.OK).json(await CategoryService.findAll());
    } catch (error) {
      next(error);
    }
  },
);

CategoryRouter.post(
  '/',
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.CREATED)
        .json(
          await CategoryService.save(
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

CategoryRouter.put(
  '/:id',
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, created } = await CategoryService.createOrUpdate(
        parseInt(req.params.id),
        req.body.name,
        req.body.slug,
        req.body.image,
      );

      return res
        .status(created ? StatusCodes.CREATED : StatusCodes.OK)
        .json(category);
    } catch (error) {
      next(error);
    }
  },
);

CategoryRouter.delete(
  '/:id',
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await CategoryService.delete(parseInt(req.params.id)));
    } catch (error) {
      next(error);
    }
  },
);

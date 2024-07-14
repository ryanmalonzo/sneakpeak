import { NextFunction, Request, Response, Router } from 'express';
import { CategoryService } from '../services/CategoryService';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { auth } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { schema } from '../middlewares/schema';

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
  schema({
    name: z.string(),
    slug: z.string(),
    image: z.string(),
  }),
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
  schema({
    name: z.string(),
    slug: z.string(),
    image: z.string(),
  }),
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

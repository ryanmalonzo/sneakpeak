import { NextFunction, Request, Response, Router } from 'express';
import { CategoryService } from '../services/CategoryService';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { auth } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { schema } from '../middlewares/schema';
import { pagination } from '../middlewares/pagination';

export const CategoryRouter = Router();

CategoryRouter.get(
  '/',
  pagination({
    name: 'in',
    slug: 'in',
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, page, limit, sortOptions, filterOptions } = res.locals;

      return res
        .status(StatusCodes.OK)
        .json(
          await CategoryService.getPaginated(
            q,
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

CategoryRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await CategoryService.find({ id: parseInt(req.params.id) }));
    } catch (error) {
      next(error);
    }
  },
);

CategoryRouter.post(
  '/',
  schema(
    z.object({
      name: z.string(),
      image: z.string(),
    }),
  ),
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.CREATED)
        .json(await CategoryService.save(req.body.name, req.body.image));
    } catch (error) {
      next(error);
    }
  },
);

CategoryRouter.put(
  '/:id',
  schema(
    z.object({
      name: z.string(),
      image: z.string(),
    }),
  ),
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, created } = await CategoryService.createOrUpdate(
        parseInt(req.params.id),
        req.body.name,
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

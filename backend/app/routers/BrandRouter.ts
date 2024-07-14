import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { BrandService } from '../services/BrandService';
import { auth } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { schema } from '../middlewares/schema';

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
          await BrandService.save(req.body.name, req.body.slug, req.body.image),
        );
    } catch (error) {
      next(error);
    }
  },
);

BrandRouter.put(
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
      const { brand, created } = await BrandService.createOrUpdate(
        parseInt(req.params.id),
        req.body.name,
        req.body.slug,
        req.body.image,
      );

      return res
        .status(created ? StatusCodes.CREATED : StatusCodes.OK)
        .json(brand);
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

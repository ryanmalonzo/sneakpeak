import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { ColorService } from '../services/ColorService';
import { auth } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { schema } from '../middlewares/schema';
import { pagination } from '../middlewares/pagination';

export const ColorRouter = Router();

ColorRouter.get(
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
          await ColorService.getPaginated(
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

ColorRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await ColorService.find({ id: parseInt(req.params.id) }));
    } catch (error) {
      next(error);
    }
  },
);

ColorRouter.post(
  '/',
  schema(
    z.object({
      name: z.string(),
      hexCode: z.string(),
    }),
  ),
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.CREATED)
        .json(await ColorService.save(req.body.name, req.body.hexCode));
    } catch (error) {
      next(error);
    }
  },
);

ColorRouter.put(
  '/:id',
  schema(
    z.object({
      name: z.string(),
      hexCode: z.string(),
    }),
  ),
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { color, created } = await ColorService.createOrUpdate(
        parseInt(req.params.id),
        req.body.name,
        req.body.hexCode,
      );

      return res
        .status(created ? StatusCodes.CREATED : StatusCodes.OK)
        .json(color);
    } catch (error) {
      next(error);
    }
  },
);

ColorRouter.delete(
  '/:id',
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await ColorService.delete(parseInt(req.params.id)));
    } catch (error) {
      next(error);
    }
  },
);

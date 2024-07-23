import { NextFunction, Request, Response, Router } from 'express';
import z from 'zod';
import { VariantService } from '../services/VariantService';
import { StatusCodes } from 'http-status-codes';
import { VariantDTO } from '../models/sql/Variant';
import { auth } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { schema } from '../middlewares/schema';

export const VariantRouter = Router();

VariantRouter.post(
  '/',
  schema(
    z.object({
      stock: z.number(),
      image: z.string(),
      isBest: z.boolean(),
      sneakerId: z.number(),
      colorId: z.number(),
      sizeId: z.number(),
    }),
  ),
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    const { stock, image, isBest, sneakerId, colorId, sizeId } = req.body;
    const variant: VariantDTO = {
      stock,
      image,
      isBest,
      sneakerId,
      colorId,
      sizeId,
    };

    try {
      return res
        .status(StatusCodes.CREATED)
        .json(await VariantService.create(variant));
    } catch (error) {
      next(error);
    }
  },
);

VariantRouter.patch(
  '/:id',
  schema(
    z.object({
      stock: z.number().optional(),
      image: z.string().optional(),
      isBest: z.boolean().optional(),
      sneakerId: z.number().optional(),
      colorId: z.number().optional(),
      sizeId: z.number().optional(),
    }),
  ),
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { stock, image, isBest, sneakerId, colorId, sizeId } = req.body;
      const variant: VariantDTO = {
        stock,
        image,
        isBest,
        sneakerId,
        colorId,
        sizeId,
      };

    const updatedVariant = await VariantService.partialUpdate(
      parseInt(id, 10), 
      variant
    )

      return res.status(StatusCodes.OK).json(updatedVariant);
    } catch (error) {
      next(error);
    }
  },
);

VariantRouter.delete(
  '/:id',
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const nbDeleted = await VariantService.delete(parseInt(id, 10));

      return res.sendStatus(
        nbDeleted ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND,
      );
    } catch (error) {
      next(error);
    }
  },
);

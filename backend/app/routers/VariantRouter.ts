import { NextFunction, Request, Response, Router } from 'express';
import { VariantService } from '../services/VariantService';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../middlewares/pagination';
import { VariantDTO } from '../models/sql/Variant';

export const VariantRouter = Router();

VariantRouter.get(
  '/',
  pagination({
    color: 'in',
    size: 'in',
    price: 'range',
    stock: 'range',
    isBest: 'in',
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, page, limit, sortOptions, filterOptions } = res.locals;

      return res
        .status(StatusCodes.OK)
        .json(
          await VariantService.getPaginated(
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

VariantRouter.post(
  '/',
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
    if (!stock || !image || !sneakerId || !colorId || !sizeId) {
      return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    }

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
  async (req: Request, res: Response, next: NextFunction) => {
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

    try {
      return res
        .status(StatusCodes.OK)
        .json(await VariantService.partialUpdate(parseInt(id, 10), variant));
    } catch (error) {
      next(error);
    }
  },
);

VariantRouter.delete(
  '/:id',
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

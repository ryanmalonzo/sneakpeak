import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { SizeService } from "../services/SizeService";
import { pagination } from "../middlewares/pagination";

export const SizeRouter = Router();

SizeRouter.get(
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
          await SizeService.getPaginated(
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
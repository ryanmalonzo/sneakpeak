import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { SortOptions } from '../helpers/interfaces';

const MAX_LIMIT = 100;

export const pagination = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { page = 1, limit = 1, sort = '_id', order = 'asc' } = req.query;
  const pageInt = Number(page);
  const limitInt = Number(limit);

  if (page !== undefined) {
    if (Number.isNaN(pageInt) || pageInt < 1) {
      next(new RequestError(StatusCodes.BAD_REQUEST, 'invalid_page'));
      return;
    }
  }

  if (limit !== undefined) {
    if (Number.isNaN(limitInt) || limitInt < 1 || limitInt > MAX_LIMIT) {
      next(new RequestError(StatusCodes.BAD_REQUEST, 'invalid_limit'));
      return;
    }
  }

  if (sort && typeof sort !== 'string') {
    next(new RequestError(StatusCodes.BAD_REQUEST, 'invalid_sort'));
    return;
  }

  if (order && typeof order !== 'string') {
    next(new RequestError(StatusCodes.BAD_REQUEST, 'invalid_order'));
    return;
  }

  const sortOptions: SortOptions = {};
  sortOptions[sort as string] = order === 'asc' ? 1 : -1;

  res.locals.page = pageInt;
  res.locals.limit = limitInt;
  res.locals.sortOptions = sortOptions;

  next();
};

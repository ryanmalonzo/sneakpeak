import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { FilterOptions, SortOptions } from '../helpers/interfaces';

const MAX_LIMIT = 100;

interface AuthorizedFilters {
  [key: string]: 'in' | 'range' | 'boolean';
}

export const pagination = (authorizedFilters?: AuthorizedFilters) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {
      q,
      page = 1,
      limit = 25,
      sort = '_id',
      order = 'asc',
      ...filters
    } = req.query;

    const pageInt = Number(page);
    const limitInt = Number(limit);

    if (page !== undefined) {
      if (Number.isNaN(pageInt) || pageInt < 1) {
        next(new RequestError(StatusCodes.UNPROCESSABLE_ENTITY));
        return;
      }
    }

    if (limit !== undefined) {
      if (Number.isNaN(limitInt) || limitInt < 1) {
        next(new RequestError(StatusCodes.UNPROCESSABLE_ENTITY));
        return;
      }
    }

    if (sort && typeof sort !== 'string') {
      next(new RequestError(StatusCodes.UNPROCESSABLE_ENTITY));
      return;
    }

    if (order && typeof order !== 'string') {
      next(new RequestError(StatusCodes.UNPROCESSABLE_ENTITY));
      return;
    }

    const sortOptions: SortOptions = {};
    sortOptions[sort as string] = order === 'asc' ? 1 : -1;

    const filterOptions: FilterOptions = {};
    if (authorizedFilters) {
      for (const key in filters) {
        // Check if the filter is registered, if not, ignore it
        if (authorizedFilters[key] === undefined) {
          continue;
        }

        const value = filters[key] as string;
        const operator = authorizedFilters[key];

        // e.g. brand=nike,adidas
        if (operator === 'in') {
          filterOptions[key] = {
            $in: value.split(','),
          };
          continue;
        }

        // e.g. price=100,200
        if (operator === 'range') {
          const [min, max] = value.split(',');
          filterOptions[key] = {
            $gte: Number(min),
            $lte: Number(max),
          };
          continue;
        }

        if (operator === 'boolean') {
          filterOptions[key] = value === 'true';
          continue;
        }
      }
    }

    res.locals.q = q;
    res.locals.page = pageInt;
    res.locals.limit = Math.min(limitInt, MAX_LIMIT);
    res.locals.sortOptions = sortOptions;
    res.locals.filterOptions = filterOptions;

    next();
  };
};

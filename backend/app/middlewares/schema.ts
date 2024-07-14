import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { RequestError } from '../helpers/error';

/**
 * Verifies if the request payload is valid
 * @throws 422 if the payload is not valid
 */

export const schema = (zodSchema: Record<string, unknown>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema = z.object(
      zodSchema as unknown as Record<string, z.ZodTypeAny>,
    );
    const { error } = schema.safeParse(req.body);

    if (error) {
      next(new RequestError(StatusCodes.UNPROCESSABLE_ENTITY));
      return;
    }

    next();
  };
};

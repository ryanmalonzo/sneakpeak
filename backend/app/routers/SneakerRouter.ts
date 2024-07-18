import { NextFunction, Request, Response, Router } from 'express';
import z from 'zod';
import { SneakerService } from '../services/SneakerService';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../middlewares/pagination';
import { auth } from '../middlewares/auth';
import { admin } from '../middlewares/admin';
import { schema } from '../middlewares/schema';
import { SneakerDTO } from '../models/sql/Sneaker';

export const SneakerRouter = Router();

SneakerRouter.get(
  '/',
  pagination({
    brand: 'in',
    category: 'in',
    price: 'range',
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, page, limit, sortOptions, filterOptions } = res.locals;

      return res
        .status(StatusCodes.OK)
        .json(
          await SneakerService.getPaginated(
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

// GET /sneakers/variants
// Cette route permet de récupérer les variantes de sneakers directement, sans passer par les sneakers en elles-mêmes
// Utilisée notamment pour afficher les dernière sorties et tendances sur la page d'accueil
SneakerRouter.get(
  '/variants',
  pagination({
    'variants.isBest': 'boolean',
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, page, limit, sortOptions, filterOptions } = res.locals;

      return res
        .status(StatusCodes.OK)
        .json(
          await SneakerService.getVariantsPaginated(
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

SneakerRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res
        .status(StatusCodes.OK)
        .json(await SneakerService.find({ id: parseInt(req.params.id) }));
    } catch (error) {
      next(error);
    }
  },
);

SneakerRouter.get(
  '/:slug',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;

      const sneaker = await SneakerService.findOneBySlug(slug);

      if (!sneaker) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }

      return res.status(StatusCodes.OK).json(sneaker);
    } catch (error) {
      next(error);
    }
  },
);

SneakerRouter.post(
  '/',
  schema(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      categoryId: z.number(),
      brandId: z.number(),
    }),
  ),
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, categoryId, brandId } = req.body;
    const sneaker: SneakerDTO = {
      name,
      description,
      price,
      categoryId,
      brandId,
    };

    try {
      return res
        .status(StatusCodes.CREATED)
        .json(await SneakerService.create(sneaker));
    } catch (error) {
      next(error);
    }
  },
);

SneakerRouter.put(
  '/:id',
  schema(
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      categoryId: z.number(),
      brandId: z.number(),
    }),
  ),
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sneaker, created } = await SneakerService.createOrUpdate(
        parseInt(req.params.id),
        req.body.name,
        req.body.description,
        req.body.price,
        req.body.categoryId,
        req.body.brandId,
      );

      return res
        .status(created ? StatusCodes.CREATED : StatusCodes.OK)
        .json(sneaker);
    } catch (error) {
      next(error);
    }
  },
);

SneakerRouter.patch(
  '/:id',
  auth,
  admin,
  schema(
    z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      categoryId: z.number().optional(),
      brandId: z.number().optional(),
    }),
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description, price, categoryId, brandId } = req.body;
      const sneaker: SneakerDTO = {
        name,
        description,
        price,
        categoryId,
        brandId,
      };

      const updatedSneaker = await SneakerService.partialUpdate(
        parseInt(id, 10),
        sneaker,
      );

      return res.status(StatusCodes.OK).json(updatedSneaker);
    } catch (error) {
      next(error);
    }
  },
);

SneakerRouter.delete(
  '/:id',
  auth,
  admin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const nbDeleted = await SneakerService.delete(parseInt(id, 10));

      return res.sendStatus(
        nbDeleted ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND,
      );
    } catch (error) {
      next(error);
    }
  },
);

import { NextFunction, Request, Response, Router } from 'express';
import { SneakerService } from '../services/SneakerService';
import { StatusCodes } from 'http-status-codes';
import { pagination } from '../middlewares/pagination';
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
      const { id } = req.params;

      const sneaker = await SneakerService.findOneById(id);

      if (!sneaker) {
        return res.sendStatus(StatusCodes.NOT_FOUND);
      }
      return res
        .status(StatusCodes.OK)
        .json(await SneakerService.findOneById(id));
    } catch (error) {
      next(error);
    }
  },
);

SneakerRouter.post(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, categoryId, brandId } = req.body;
    const sneaker: SneakerDTO = {
      name,
      description,
      price,
      categoryId,
      brandId,
    };

    if (!name || !description || !price || !categoryId || !brandId) {
      return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    }

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

      if (!name || !description || !price || !categoryId || !brandId) {
        return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
      }

      const { nbDeleted, updatedSneaker } = await SneakerService.fullUpdate(
        id,
        sneaker,
      );

      return res
        .status(nbDeleted ? StatusCodes.OK : StatusCodes.CREATED)
        .json(updatedSneaker);
    } catch (error) {
      next(error);
    }
  },
);

SneakerRouter.patch(
  '/:id',
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

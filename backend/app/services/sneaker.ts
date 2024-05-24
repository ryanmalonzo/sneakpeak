import { HydratedDocument } from 'mongoose';
import { SneakerRepository } from '../repositories/sneaker';
import { ISneaker } from '../models/sneaker';
import { RequestError } from '../helpers/error';
import { StatusCodes } from 'http-status-codes';

interface PaginatedSneakersResponse {
  total: number;
  page: number;
  limit: number;
  items: HydratedDocument<ISneaker>[];
}

export class SneakerService {
  public static async getPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedSneakersResponse> {
    if (Number.isNaN(page) || page < 1) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_page');
    }
    if (Number.isNaN(limit) || limit < 1) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_limit');
    }

    const sneakers = await SneakerRepository.getPaginated(page, limit);

    // Pour en déduire le nombre total de pages à afficher sur la web app
    const totalCount = await SneakerRepository.getTotalCount();

    return {
      total: totalCount,
      page,
      limit,
      items: sneakers,
    };
  }
}

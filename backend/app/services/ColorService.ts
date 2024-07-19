import { ColorRepository } from '../repositories/sql/ColorRepository';
import { ColorRepository as ColorRepositoryMongoDB } from '../repositories/mongodb/ColorRepository';
import { Color } from '../models/sql/Color';
import { RequestError } from '../helpers/error';
import { StatusCodes } from 'http-status-codes';
import { HydratedDocument } from 'mongoose';
import { IColor } from '../models/mongodb/Color';
import {
  FilterOptions,
  PaginatedResponse,
  SortOptions,
} from '../helpers/interfaces';

export class ColorService {
  static async findAll(): Promise<HydratedDocument<IColor>[]> {
    const colors = await ColorRepositoryMongoDB.findAll();
    return colors;
  }

  static async find(
    filterOptions: FilterOptions,
  ): Promise<HydratedDocument<IColor> | null> {
    const color = await ColorRepositoryMongoDB.findOne(filterOptions);
    if (!color) {
      throw new RequestError(StatusCodes.NOT_FOUND);
    }
    return color;
  }

  static async save(name: string, hexCode: string): Promise<Color> {
    const color = ColorRepository.build({
      name,
      hexCode,
    });
    await ColorRepository.save(color);
    return color;
  }

  static async createOrUpdate(
    id: number,
    name: string,
    hexCode: string,
  ): Promise<{ created: boolean; color: Color }> {
    const { created, color } = await ColorRepository.updateOrCreate(id, {
      name,
      hexCode,
    });
    return { created, color };
  }

  static async delete(id: number): Promise<Color> {
    const color = await ColorRepository.delete(id);
    if (!color) {
      throw new RequestError(StatusCodes.NOT_FOUND);
    }
    return color;
  }

  static async getPaginated(
    q: string,
    page: number,
    limit: number,
    sortOptions: SortOptions,
    filterOptions: FilterOptions,
  ): Promise<PaginatedResponse<HydratedDocument<IColor>>> {
    let allFilterOptions: Record<string, unknown> = {};
    if (q) {
      allFilterOptions['$or'] = [
        { name: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ];
    }
    allFilterOptions = { ...allFilterOptions, ...filterOptions };

    const colors = await ColorRepositoryMongoDB.getPaginated(
      page,
      limit,
      sortOptions,
      allFilterOptions,
    );

    const totalCount = await ColorRepositoryMongoDB.getTotalCount(
      sortOptions,
      allFilterOptions,
    );

    return {
      total: totalCount,
      page,
      limit,
      items: colors,
    };
  }
}

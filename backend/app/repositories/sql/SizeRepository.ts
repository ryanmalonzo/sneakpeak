import { Size } from '../../models/sql/Size';

export class SizeRepository {
  static async findSizeById(brandId: number): Promise<Size | null> {
    return await Size.findByPk(brandId);
  }
}

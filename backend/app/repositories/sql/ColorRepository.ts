import { Color } from '../../models/sql/Color';

export class ColorRepository {
  static async findColorById(brandId: number): Promise<Color | null> {
    return await Color.findByPk(brandId);
  }
}

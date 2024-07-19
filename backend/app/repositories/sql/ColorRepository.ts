import { Color } from '../../models/sql/Color';

export class ColorRepository {
  static async findColorById(colorId: number): Promise<Color | null> {
    return await Color.findByPk(colorId);
  }
}

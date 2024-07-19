import { Color } from '../../models/sql/Color';

export class ColorRepository {
  static build(data: Partial<Color>): Color {
    return Color.build(data);
  }

  static async save(color: Color): Promise<Color> {
    await color.save();
    return color;
  }

  static async updateOrCreate(
    colorId: number,
    data: Partial<Color>,
  ): Promise<{ created: boolean; color: Color }> {
    let color = await Color.findByPk(colorId);

    if (!color) {
      color = await Color.create(data);
      return { created: true, color };
    }

    color = await color.update(data);
    return { created: false, color };
  }

  static async delete(colorId: number): Promise<Color | null> {
    const color = await Color.findByPk(colorId);
    if (!color) {
      return null;
    }
    await color.destroy();
    return color;
  }

  static async findColorById(colorId: number): Promise<Color | null> {
    return await Color.findByPk(colorId);
  }
}

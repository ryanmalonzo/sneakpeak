import { Sneaker, SneakerDTO } from '../../models/sql/Sneaker';

export class SneakerRepository {
  static async findSneakerById(id: number): Promise<Sneaker | null> {
    const sneaker = await Sneaker.findByPk(id);
    return sneaker;
  }

  static async findSneakerByName(name: string): Promise<Sneaker | null> {
    const sneaker = await Sneaker.findOne({ where: { name } });
    return sneaker;
  }

  static async delete(id: number): Promise<number> {
    return await Sneaker.destroy({ where: { id }, individualHooks: true });
  }

  static async create(sneaker: SneakerDTO): Promise<Sneaker> {
    return await Sneaker.create({ ...sneaker });
  }

  static async fullUpdate(
    id: string,
    sneaker: SneakerDTO,
  ): Promise<{ nbDeleted: number; updatedSneaker: Sneaker }> {
    const nbDeleted = await Sneaker.destroy({
      where: {
        id: parseInt(id, 10),
      },
      individualHooks: true,
    });

    const updatedSneaker = await Sneaker.create({ id, ...sneaker });
    return { nbDeleted, updatedSneaker };
  }

  static async partialUpdate(
    id: number,
    sneaker: SneakerDTO,
  ): Promise<Sneaker | null> {
    const [_nbUpdated, updatedSneaker] = await Sneaker.update(sneaker, {
      where: { id },
      individualHooks: true,
      returning: true,
    });

    return updatedSneaker[0];
  }

  static async findAllSneakersByBrandId(brandId: number): Promise<Sneaker[]> {
    return await Sneaker.findAll({ where: { brandId } });
  }
}

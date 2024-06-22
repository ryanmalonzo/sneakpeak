import { HydratedDocument } from 'mongoose';
import { ISneaker } from '../../models/mongodb/Sneaker';
import { Sneaker } from '../../models/sql/Sneaker';

export class SneakerRepository {
  static async findSneakerById(id: number): Promise<Sneaker | null> {
    return await Sneaker.findByPk(id);
  }

  static async delete(id: number): Promise<void> {
    await Sneaker.findByPk(id).then((sneaker) => {
      if (sneaker) {
        sneaker.destroy();
      }
    });
  }

  static async create(
    sneaker: HydratedDocument<ISneaker>,
  ): Promise<HydratedDocument<ISneaker>> {
    await sneaker.save();
    return sneaker;
  }
}

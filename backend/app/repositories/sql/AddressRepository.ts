import { Address } from '../../models/sql/Address';

export class AddressRepository {
  static build(data: Partial<Address>): Address {
    return Address.build(data);
  }

  static async createOrUpdate(
    userId: number,
    data: Partial<Address>,
  ): Promise<{ created: boolean; address: Address }> {
    let address = await this.findAddressByUserIdAndType(userId, data.type!);

    if (!address) {
      console.log(data);
      address = await Address.create(data);
      console.log('fdp', address);
      return { created: true, address };
    }

    address = await address.update(data);
    return { created: false, address };
  }

  static async findAddressByUserIdAndType(
    userId: number,
    type: string,
  ): Promise<Address | null> {
    return await Address.findOne({
      where: { userId, type },
    });
  }
}

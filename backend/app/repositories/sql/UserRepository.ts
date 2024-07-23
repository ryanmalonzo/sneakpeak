import { User } from '../../models/sql/User';

export class UserRepository {
  static build(data: Partial<User>): User {
    return User.build(data);
  }

  static async save(user: User): Promise<User> {
    await user.save();
    return user;
  }

  static async update(
    userId: number,
    data: Partial<User>,
  ): Promise<User | null> {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }
    return await user.update(data);
  }

  static async findById(userId: number): Promise<User | null> {
    return User.findByPk(userId);
  }

  static async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  static async findAll(): Promise<User[]> {
    return User.findAll();
  }

  static async findByRole(role: string): Promise<User[]> {
    return User.findAll({ where: { role } });
  }
}

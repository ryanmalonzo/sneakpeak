import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { User, IUser } from '../models/user';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 10;

export class UserManager {
  static async create(email: string, password: string) {
    const user = new User({ email, password });
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    await user.save();
    return user;
  }

  static async update(userId: ObjectId, data: Partial<IUser>) {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  }

  static async delete(userId: string) {
    return await User.findByIdAndDelete(userId);
  }

  static async findById(userId: string) {
    return await User.findById(userId);
  }

  static async findByEmail(email: string) {
    return await User.findOne({
      email,
    });
  }

  static async findUserByRole(role: string) {
    return await User.findOne({
      role,
    });
  }

  static async findUsersByRole(role: string) {
    return await User.find({
      role,
    });
  }

  static async findUsers() {
    return await User.find();
  }

  static async findUserVerifiedEmail(email: string) {
    return await User.findOne({
      email,
      'challenge.email.verified': true,
    });
  }

  static async findUserNotVerifiedEmail(email: string) {
    return await User.findOne({
      email,
      'challenge.email.verified': false,
    });
  }

  static async findByEmailAndPassword(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordCorrect = await this._comparePassword(user, password);
    if (!isPasswordCorrect) {
      return null;
    }
    return user;
  }

  static async changePassword(userId: ObjectId, newPassword: string) {
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    return await User.findByIdAndUpdate(
      userId,
      { password: hash },
      { new: true },
    );
  }

  private static async _comparePassword(
    user: HydratedDocument<IUser>,
    password: string,
  ) {
    return await bcrypt.compare(password, user.password);
  }
}

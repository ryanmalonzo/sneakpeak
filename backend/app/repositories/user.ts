import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { User, IUser } from '../models/user';

export class UserRepository {
  static async create(
    user: HydratedDocument<IUser>,
  ): Promise<HydratedDocument<IUser>> {
    await user.save();
    return user;
  }

  static async update(
    userId: ObjectId,
    data: Partial<IUser>,
  ): Promise<HydratedDocument<IUser> | null> {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  }

  static async delete(userId: string): Promise<HydratedDocument<IUser> | null> {
    return await User.findByIdAndDelete(userId);
  }

  static async findById(
    userId: string,
  ): Promise<HydratedDocument<IUser> | null> {
    return await User.findById(userId);
  }

  static async findByEmail(
    email: string,
  ): Promise<HydratedDocument<IUser> | null> {
    return await User.findOne({ email });
  }

  static async findUserByRole(
    role: string,
  ): Promise<HydratedDocument<IUser> | null> {
    return await User.findOne({
      role,
    });
  }

  static async findUsersByRole(
    role: string,
  ): Promise<HydratedDocument<IUser>[]> {
    return await User.find({
      role,
    });
  }

  static async findUsers(): Promise<HydratedDocument<IUser>[]> {
    return await User.find();
  }

  static async findUsersVerifiedEmail(
    email: string,
  ): Promise<HydratedDocument<IUser>[]> {
    return await User.find({
      email,
      'challenge.email.verified': true,
    });
  }

  static async findUsersNotVerifiedEmail(
    email: string,
  ): Promise<HydratedDocument<IUser>[]> {
    return await User.find({
      email,
      'challenge.email.verified': false,
    });
  }
}

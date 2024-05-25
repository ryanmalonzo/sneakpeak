import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { UserModel, IUser } from '../models/user';

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
    return await UserModel.findByIdAndUpdate(userId, data, { new: true });
  }

  static async delete(userId: string): Promise<HydratedDocument<IUser> | null> {
    return await UserModel.findByIdAndDelete(userId);
  }

  static async findById(
    userId: string,
  ): Promise<HydratedDocument<IUser> | null> {
    return await UserModel.findById(userId);
  }

  static async findByEmail(
    email: string,
  ): Promise<HydratedDocument<IUser> | null> {
    return await UserModel.findOne({ email });
  }

  static async findUserByRole(
    role: string,
  ): Promise<HydratedDocument<IUser> | null> {
    return await UserModel.findOne({
      role,
    });
  }

  static async findUsersByRole(
    role: string,
  ): Promise<HydratedDocument<IUser>[]> {
    return await UserModel.find({
      role,
    });
  }

  static async findUsers(): Promise<HydratedDocument<IUser>[]> {
    return await UserModel.find();
  }

  static async findUsersVerifiedEmail(
    email: string,
  ): Promise<HydratedDocument<IUser>[]> {
    return await UserModel.find({
      email,
      'challenge.email.verified': true,
    });
  }

  static async findUsersNotVerifiedEmail(
    email: string,
  ): Promise<HydratedDocument<IUser>[]> {
    return await UserModel.find({
      email,
      'challenge.email.verified': false,
    });
  }
}

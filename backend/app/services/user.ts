import { HydratedDocument } from 'mongoose';
import { User, IUser } from '../models/user';
import { PostmarkClient } from '../helpers/postmark';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { RequestError } from '../helpers/error';
import { StatusCodes } from 'http-status-codes';

const ACCOUNT_VERIFICATION_TEMPLATE_ID = 35812359;
const JWT_EXPIRY_TIME = '1h';

export class UserService {
  static async findById(userId: string) {
    return await User.findById(userId);
  }

  static async findByEmail(email: string) {
    return await User.findOne({
      email,
    });
  }

  static async registerUser(email: string, password: string) {
    if (await UserService.findByEmail(email)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'user_already_exists');
    }

    const user = new User({ email, password });
    await UserService.sendVerificationEmail(user, email);
  }

  static async sendVerificationEmail(
    user: HydratedDocument<IUser>,
    email: string,
  ) {
    if (user.challenge.email.verified) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'email_already_verified');
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Store token in user document
    user.challenge.email.token = emailVerificationToken;
    user.challenge.email.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1d
    await user.save();

    await PostmarkClient.sendEmail(email, ACCOUNT_VERIFICATION_TEMPLATE_ID, {
      verification_url: `${process.env.API_URL}/api/users/${user._id}/challenge/email?token=${emailVerificationToken}`,
    });
  }

  static async verifyEmail(user: HydratedDocument<IUser>, token: string) {
    if (user.challenge.email.verified) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'email_already_verified');
    }
    if (user.challenge.email.token !== token) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_token');
    }
    if (user.challenge.email.expiresAt < new Date()) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'token_expired');
    }

    user.challenge.email.verified = true;
    await user.save();

    return {
      token: UserService.generateAuthToken(user),
    };
  }

  static generateAuthToken(user: HydratedDocument<IUser>) {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: JWT_EXPIRY_TIME,
    });
  }
}

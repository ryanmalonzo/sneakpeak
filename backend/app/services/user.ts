import { HydratedDocument } from 'mongoose';

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { PostmarkClient } from '../helpers/postmark';
import { IUser } from '../models/user';
import { UserRepository } from '../repositories/userRepository';

const ACCOUNT_VERIFICATION_TEMPLATE_ID = 35812359;
const JWT_EXPIRY_TIME = '1h';

export class UserService {
  
  static async registerUser(email: string, password: string): Promise<void> {
    if (await UserRepository.findByEmail(email)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'user_already_exists');
    }

    const user = await UserRepository.create(email, password);

    await UserService.sendVerificationEmail(user, email);
  }

  static async sendVerificationEmail(
    user: HydratedDocument<IUser>,
    email: string,
  ): Promise<void> {
    if (user.challenge.email.verified) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'email_already_verified');
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Store token in user document
    user.challenge.email.token = emailVerificationToken;
    user.challenge.email.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1d
    await UserRepository.update(user._id, user);

    await PostmarkClient.sendEmail(email, ACCOUNT_VERIFICATION_TEMPLATE_ID, {
      verification_url: `${process.env.WEBAPP_URL}/verify-email?id=${user._id}&token=${emailVerificationToken}`,
    });
  }

  static async verifyEmail(
    user: HydratedDocument<IUser>,
    token: string,
  ): Promise<{ token: string }> {
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
    await UserRepository.update(user._id, user);

    return {
      token: UserService.generateAuthToken(user),
    };
  }

  static generateAuthToken(user: HydratedDocument<IUser>): string {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: JWT_EXPIRY_TIME,
    });
  }
}

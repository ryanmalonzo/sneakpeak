import { HydratedDocument } from 'mongoose';

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { PostmarkClient } from '../helpers/postmark';
import { IUser } from '../models/user';
import { UserManager } from './userManager';

const ACCOUNT_VERIFICATION_TEMPLATE_ID = 35812359;
const JWT_EXPIRY_TIME = '1h';

export class UserService {
  static async registerUser(email: string, password: string) {
    if (await UserManager.findByEmail(email)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'user_already_exists');
    }

    const user = await UserManager.create(email, password);

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
    await UserManager.update(user._id, user);

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
    await UserManager.update(user._id, user);

    return {
      token: UserService._generateAuthToken(user),
    };
  }

  private static _generateAuthToken(user: HydratedDocument<IUser>) {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: JWT_EXPIRY_TIME,
    });
  }
}

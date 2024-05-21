import { HydratedDocument } from 'mongoose';

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { PostmarkClient } from '../helpers/postmark';
import { IUser, UserModel } from '../models/user';
import { UserRepository } from '../repositories/user';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const ACCOUNT_VERIFICATION_TEMPLATE_ID = 35812359;
const PASSWORD_RESET_TEMPLATE_ID = 35966741;
const JWT_EXPIRY_TIME = '1h';
const MIN_PASSWORD_LENGTH = 12;
const SALT_ROUNDS = 10;

export class UserService {
  // Vérifie si le mail renseigné a un format e-mail
  private static _isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async registerUser(email: string, password: string): Promise<void> {
    if (!UserService._isValidEmail(email)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_email');
    }
  
    if (await UserRepository.findByEmail(email)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'user_already_exists');
    }
  
    if (!UserService._checkPasswordStrength(password)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_password');
    }
  
    const user = new UserModel({ email, password });
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    user.password = hash;
    UserRepository.create(user);
  
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

  static async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Let the endpoint return a 200 status code to avoid user enumeration
      return;
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');

    // Store token in user document
    user.challenge.passwordReset.token = passwordResetToken;
    user.challenge.passwordReset.expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ); // 1d
    await UserRepository.update(user._id, user);

    await PostmarkClient.sendEmail(email, PASSWORD_RESET_TEMPLATE_ID, {
      email,
      password_reset_url: `${process.env.WEBAPP_URL}/reset-password?id=${user._id}&token=${passwordResetToken}`,
    });
  }

  static async changePassword(
    userId: ObjectId,
    newPassword: string,
  ): Promise<HydratedDocument<IUser> | null> {
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    return await UserRepository.update(userId, { password: hash });
  }

  static async resetPassword(
    user: HydratedDocument<IUser>,
    token: string,
    password: string,
  ): Promise<void> {
    if (user.challenge.passwordReset.token !== token) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_token');
    }
    if (user.challenge.passwordReset.expiresAt < new Date()) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'token_expired');
    }

    if (!UserService._checkPasswordStrength(password)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_password');
    }

    const newUser = (await this.changePassword(
      user._id,
      password,
    )) as HydratedDocument<IUser>;
    newUser.challenge.passwordReset.expiresAt = new Date();
    await UserRepository.update(newUser._id, newUser);
  }

  static generateAuthToken(user: HydratedDocument<IUser>): string {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: JWT_EXPIRY_TIME,
    });
  }

  // Recommandations de la CNIL
  private static _checkPasswordStrength(password: string): boolean {
    return (
      password.length >= MIN_PASSWORD_LENGTH &&
      /[^A-Za-z0-9]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }
}

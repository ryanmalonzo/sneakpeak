import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { RequestError } from '../helpers/error';
import { PostmarkClient } from '../helpers/postmark';
import { User } from '../models/user';
import { UserRepository } from '../repositories/user';
import bcrypt from 'bcrypt';
import { ChallengeRepository } from '../repositories/challenge';

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

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = UserRepository.build({ email, password: hash });
    await UserRepository.save(user);

    await UserService.sendVerificationEmail(user, email);
  }

  static async sendVerificationEmail(user: User, email: string): Promise<void> {
    if (!UserService._isValidEmail(email)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_email');
    }

    const challenge = await ChallengeRepository.findByUserAndType(
      user,
      'email',
    );

    if (challenge?.disabled) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'email_already_verified');
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    await ChallengeRepository.saveOrUpdate(challenge, {
      type: 'email',
      token: emailVerificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1d
      userId: user.id,
    });

    await PostmarkClient.sendEmail(email, ACCOUNT_VERIFICATION_TEMPLATE_ID, {
      verification_url: `${process.env.WEBAPP_URL}/verify-email?id=${user.id}&token=${emailVerificationToken}`,
    });
  }

  static async verifyEmail(
    user: User,
    token: string,
  ): Promise<{ token: string }> {
    const challenge = await ChallengeRepository.findByUserAndType(
      user,
      'email',
    );

    if (!challenge) {
      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (challenge.disabled) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'email_already_verified');
    }
    if (challenge.token !== token) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_token');
    }
    if (challenge.expiresAt < new Date()) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'token_expired');
    }

    await ChallengeRepository.update(challenge, { disabled: true });

    return {
      token: UserService.generateAuthToken(user),
    };
  }

  static async sendPasswordResetEmail(email: string): Promise<void> {
    if (!UserService._isValidEmail(email)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_email');
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Let the endpoint return a 200 status code to avoid user enumeration
      return;
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');

    const challenge = await ChallengeRepository.findByUserAndType(
      user,
      'password-reset',
    );
    await ChallengeRepository.saveOrUpdate(challenge, {
      type: 'password-reset',
      token: passwordResetToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1d
      userId: user.id,
    });

    await PostmarkClient.sendEmail(email, PASSWORD_RESET_TEMPLATE_ID, {
      email,
      password_reset_url: `${process.env.WEBAPP_URL}/reset-password?id=${user.id}&token=${passwordResetToken}`,
    });
  }

  static async changePassword(
    userId: number,
    newPassword: string,
  ): Promise<User | null> {
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    return await UserRepository.update(userId, { password: hash });
  }

  static async resetPassword(
    user: User,
    token: string,
    password: string,
  ): Promise<void> {
    const challenge = await ChallengeRepository.findByUserAndType(
      user,
      'password-reset',
    );

    if (!challenge) {
      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (challenge.token !== token) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_token');
    }
    if (challenge.expiresAt < new Date()) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'token_expired');
    }

    if (!UserService._checkPasswordStrength(password)) {
      throw new RequestError(StatusCodes.BAD_REQUEST, 'invalid_password');
    }

    await this.changePassword(user.id, password);
    await ChallengeRepository.update(challenge, { expiresAt: new Date() }); // now
  }

  static generateAuthToken(user: User): string {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
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

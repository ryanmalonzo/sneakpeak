import { StatusCodes } from 'http-status-codes';
import { UserService } from './UserService';
import { UserRepository } from '../repositories/sql/UserRepository';
import { RequestError } from '../helpers/error';
import bcrypt from 'bcrypt';
import { ChallengeRepository } from '../repositories/sql/ChallengeRepository';
import { PostmarkClient } from '../helpers/postmark';

export const MAX_PASSWORD_ATTEMPTS = 3;
export const MINUTES_TO_UNLOCK = 15;
export const ACCOUNT_LOCKED_TEMPLATE_ID = 36461724;

export class SessionService {
  static async login(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new RequestError(StatusCodes.UNAUTHORIZED, 'invalid_credentials');
    }

    const challenge = await ChallengeRepository.findByUserAndType(
      user,
      'email',
    );

    if (!challenge) {
      throw new RequestError(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (!challenge.disabled) {
      throw new RequestError(StatusCodes.UNAUTHORIZED, 'email_not_verified');
    }

    if (user.locked) {
      if (user.unlockedAt && user.unlockedAt > new Date()) {
        throw new RequestError(StatusCodes.UNAUTHORIZED, 'account_locked');
      } else {
        await UserRepository.update(user.id, {
          locked: false,
        });
      }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      const newNbAttempts = user.passwordAttempts + 1;

      await UserRepository.update(user.id, {
        passwordAttempts: newNbAttempts,
      });

      if (newNbAttempts >= MAX_PASSWORD_ATTEMPTS) {
        // Lock account
        await UserRepository.update(user.id, {
          passwordAttempts: 0,
          locked: true,
          unlockedAt: new Date(Date.now() + 60 * MINUTES_TO_UNLOCK * 1000),
        });

        // Send email
        await PostmarkClient.sendEmail(user.email, ACCOUNT_LOCKED_TEMPLATE_ID, {
          email,
          minutes: MINUTES_TO_UNLOCK,
        });

        throw new RequestError(StatusCodes.UNAUTHORIZED, 'account_locked');
      }

      throw new RequestError(StatusCodes.UNAUTHORIZED, 'invalid_credentials');
    }

    const token = UserService.generateAuthToken(user);

    // Reset password attempts
    await UserRepository.update(user.id, {
      passwordAttempts: 0,
    });

    return { token: token };
  }
}

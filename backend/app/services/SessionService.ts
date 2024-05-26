import { StatusCodes } from 'http-status-codes';
import { UserService } from './UserRouter';
import { UserRepository } from '../repositories/UserRepository';
import { RequestError } from '../helpers/error';
import bcrypt from 'bcrypt';
import { ChallengeRepository } from '../repositories/ChallengeRepository';

export class SessionService {
  static async login(
    email: string,
    password: string,
  ): Promise<{ token: string } | null> {
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

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new RequestError(StatusCodes.UNAUTHORIZED, 'wrong_password');
    }

    return {
      token: UserService.generateAuthToken(user),
    };
  }
}

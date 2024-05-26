import { StatusCodes } from 'http-status-codes';
import { UserService } from './user';
import { UserRepository } from '../repositories/user';
import { RequestError } from '../helpers/error';
import bcrypt from 'bcrypt';
import { ChallengeRepository } from '../repositories/challenge';

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
    if (!challenge.verified) {
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

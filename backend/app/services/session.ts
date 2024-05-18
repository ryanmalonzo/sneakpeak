import { StatusCodes } from 'http-status-codes';
import { UserService } from './user';
import { UserRepository } from '../repositories/user';
import { RequestError } from '../helpers/error';
import bcrypt from 'bcrypt';

export class SessionService {
  static async login(
    email: string,
    password: string,
  ): Promise<{ token: string } | null> {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new RequestError(StatusCodes.UNAUTHORIZED, 'invalid_credentials');
    }

    if (!user.challenge.email.verified) {
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

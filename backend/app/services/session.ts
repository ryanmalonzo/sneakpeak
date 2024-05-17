import { StatusCodes } from 'http-status-codes';
import { UserService } from './user';
import { UserRepository } from '../repositories/user';
import { RequestError } from '../helpers/error';

export class SessionService {
  static async login(
    email: string,
    password: string,
  ): Promise<{ token: string }> {
    const user = await UserRepository.findByEmailAndPassword(email, password);

    if (!user) {
      throw new RequestError(StatusCodes.UNAUTHORIZED, 'invalid_credentials');
    }

    if (!user.challenge.email.verified) {
      throw new RequestError(StatusCodes.UNAUTHORIZED, 'email_not_verified');
    }

    return {
      token: UserService.generateAuthToken(user),
    };
  }
}

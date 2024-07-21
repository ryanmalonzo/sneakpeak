import { User } from '../models/sql/User';
import { Challenge } from '../models/sql/Challenge';
import { ChallengeRepository } from '../repositories/sql/ChallengeRepository';

export class ChallengeService {
  static async findByUserAndType(
    user: User,
    type: string,
  ): Promise<Challenge | null> {
    return ChallengeRepository.findByUserAndType(user, type);
  }
}

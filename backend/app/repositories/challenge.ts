import { FindOptions } from 'sequelize';
import { Challenge } from '../models/challenge';
import { User } from '../models/user';

export class ChallengeRepository {
  static build(data: Partial<Challenge>): Challenge {
    return Challenge.build(data);
  }

  static async save(challenge: Challenge): Promise<Challenge> {
    await challenge.save();
    return challenge;
  }

  static async update(
    challenge: Challenge,
    data: Partial<Challenge>,
  ): Promise<Challenge> {
    return await challenge.update(data);
  }

  static async saveOrUpdate(
    challenge: Challenge | null,
    data: Partial<Challenge>,
  ): Promise<Challenge> {
    if (!challenge) {
      const newChallenge = ChallengeRepository.build(data);
      return ChallengeRepository.save(newChallenge);
    }
    return await challenge.update(data);
  }

  static async findByUser(
    user: User,
    options?: FindOptions,
  ): Promise<Challenge | null> {
    const challenges = await user.getChallenges(options);

    if (!challenges.length) {
      return null;
    }

    return challenges[0];
  }

  static async findByUserAndType(
    user: User,
    type: string,
    options?: FindOptions,
  ): Promise<Challenge | null> {
    const challenges = await user.getChallenges({
      where: { type },
      ...options,
    });

    if (!challenges.length) {
      return null;
    }

    return challenges[0];
  }
}

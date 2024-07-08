import bcrypt from 'bcrypt';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { PostmarkClient } from '../../app/helpers/postmark';
import { Challenge } from '../../app/models/sql/Challenge';
import { User } from '../../app/models/sql/User';
import { ChallengeRepository } from '../../app/repositories/sql/ChallengeRepository';
import { UserRepository } from '../../app/repositories/sql/UserRepository';
import { UserService } from '../../app/services/UserService';

use(chaiAsPromised);

afterEach(() => {
  sinon.restore();
});

describe('UserService', () => {
  const EMAIL = 'john.doe@gmail.com';
  const PASSWORD = 'MySuperSecurePassword123!';
  const USER = { email: EMAIL, password: PASSWORD } as User;

  describe('registerUser', () => {
    it('should create a new user', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves();
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      sinon.stub(UserRepository, 'build').returns(USER);
      sinon.stub(UserRepository, 'save').resolves();
      sinon.stub(UserService, 'sendVerificationEmail').resolves();

      await expect(UserService.registerUser(EMAIL, PASSWORD)).to.be.fulfilled;
    });

    it('should throw an error if the email is invalid', async () => {
      await expect(
        UserService.registerUser('invalid@email', PASSWORD),
      ).to.be.rejectedWith('invalid_email');
    });

    it('should throw an error when the user exists', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves(USER);

      await expect(
        UserService.registerUser(EMAIL, PASSWORD),
      ).to.be.rejectedWith('user_already_exists');
    });

    it('should throw an error when the password has no number', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves();

      await expect(
        UserService.registerUser(EMAIL, 'invalidPassword'),
      ).to.be.rejectedWith('invalid_password');
    });

    it('should throw an error when the password has no uppercase letter', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves();

      await expect(
        UserService.registerUser(EMAIL, 'invalidpassword123!'),
      ).to.be.rejectedWith('invalid_password');
    });

    it('should throw an error when the password has no lowercase letter', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves();

      await expect(
        UserService.registerUser(EMAIL, 'INVALIDPASSWORD123!'),
      ).to.be.rejectedWith('invalid_password');
    });

    it('should throw an error when the password has no special character', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves();

      await expect(
        UserService.registerUser(EMAIL, 'InvalidPassword123'),
      ).to.be.rejectedWith('invalid_password');
    });

    it('should throw an error when the password is too short', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves();

      await expect(
        UserService.registerUser(EMAIL, 'InvP123!'),
      ).to.be.rejectedWith('invalid_password');
    });

    it('should throw an error when the password is too long', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves();

      await expect(
        UserService.registerUser(EMAIL, 'InvalidPassword123!'.repeat(10)),
      ).to.be.rejectedWith('invalid_password');
    });

    it('should save the user with the hashed password', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves();
      sinon.stub(UserRepository, 'save').resolves();
      sinon.stub(UserService, 'sendVerificationEmail').resolves();

      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      const build = sinon
        .mock(UserRepository)
        .expects('build')
        .withExactArgs({
          email: EMAIL,
          password: 'hashedPassword',
          resetPassowordAt: sinon.match.instanceOf(Date),
        });

      await UserService.registerUser(EMAIL, PASSWORD);

      build.verify();
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send a verification email', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves();
      sinon.stub(ChallengeRepository, 'saveOrUpdate').resolves();
      sinon.stub(UserService, 'sendVerificationEmail').resolves();
      sinon.stub(PostmarkClient, 'sendEmail').resolves();

      await expect(UserService.sendVerificationEmail(USER, EMAIL)).to.be
        .fulfilled;
    });

    it('should throw an error when the email is invalid', async () => {
      await expect(
        UserService.sendVerificationEmail(USER, 'invalidEmail'),
      ).to.be.rejectedWith('invalid_email');
    });

    it('should throw an error when the email is already verified', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves({
        disabled: true,
      } as Challenge);

      await expect(
        UserService.sendVerificationEmail(USER, EMAIL),
      ).to.be.rejectedWith('email_already_verified');
    });

    it('should save the challenge with the email verification token', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves();
      sinon.stub(PostmarkClient, 'sendEmail').resolves();

      const saveOrUpdate = sinon
        .mock(ChallengeRepository)
        .expects('saveOrUpdate')
        .withExactArgs(undefined, {
          type: 'email',
          token: sinon.match.string,
          expiresAt: sinon.match.instanceOf(Date),
          userId: USER.id,
        });

      await UserService.sendVerificationEmail(USER, EMAIL);

      saveOrUpdate.verify();
    });

    it('should send an email with the verification URL', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves();
      sinon.stub(ChallengeRepository, 'saveOrUpdate').resolves();

      const sendEmail = sinon
        .mock(PostmarkClient)
        .expects('sendEmail')
        .withExactArgs(
          EMAIL,
          sinon.match.number,
          sinon.match({ verification_url: sinon.match.string }),
        );

      await UserService.sendVerificationEmail(USER, EMAIL);

      sendEmail.verify();
    });
  });

  describe('verifyEmail', () => {
    it('should verify the email', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves({
        disabled: false,
        token: 'token',
        expiresAt: new Date(Date.now() + 1000),
      } as Challenge);
      sinon.stub(ChallengeRepository, 'update').resolves();
      sinon.stub(UserService, 'generateAuthToken').returns('authToken');

      expect(UserService.verifyEmail(USER, 'token')).to.eventually.deep.equal({
        token: 'authToken',
      });
    });

    it('should throw an error when the challenge is not found', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves();

      await expect(UserService.verifyEmail(USER, 'token')).to.be.rejected;
    });

    it('should throw an error when the challenge is already disabled', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves({
        disabled: true,
      } as Challenge);

      await expect(UserService.verifyEmail(USER, 'token')).to.be.rejectedWith(
        'email_already_verified',
      );
    });

    it('should throw an error when the token is invalid', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves({
        disabled: false,
        token: 'token',
        expiresAt: new Date(Date.now() + 1000),
      } as Challenge);

      await expect(
        UserService.verifyEmail(USER, 'invalidToken'),
      ).to.be.rejectedWith('invalid_token');
    });

    it('should throw an error when the token is expired', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves({
        disabled: false,
        token: 'token',
        expiresAt: new Date(Date.now() - 1000),
      } as Challenge);

      await expect(UserService.verifyEmail(USER, 'token')).to.be.rejectedWith(
        'token_expired',
      );
    });

    it('should disable the challenge', async () => {
      const challenge = {
        disabled: false,
        token: 'token',
        expiresAt: new Date(Date.now() + 1000),
      } as Challenge;

      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves(challenge);
      sinon.stub(UserService, 'generateAuthToken').returns('authToken');

      const update = sinon
        .mock(ChallengeRepository)
        .expects('update')
        .withExactArgs(challenge, { disabled: true });

      await UserService.verifyEmail(USER, 'token');

      update.verify();
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send a password reset email', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves(USER);
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves();
      sinon.stub(ChallengeRepository, 'saveOrUpdate').resolves();
      sinon.stub(PostmarkClient, 'sendEmail').resolves();

      await expect(UserService.sendPasswordResetEmail(EMAIL)).to.be.fulfilled;
    });

    it('should throw an error when the email is invalid', async () => {
      await expect(
        UserService.sendPasswordResetEmail('invalidEmail'),
      ).to.be.rejectedWith('invalid_email');
    });

    it('should resolve even if the user does not exist', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves();
      await expect(UserService.sendPasswordResetEmail(EMAIL)).to.be.fulfilled;
    });

    it('should save the challenge with the password reset token', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves(USER);
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves();
      sinon.stub(PostmarkClient, 'sendEmail').resolves();

      const saveOrUpdate = sinon
        .mock(ChallengeRepository)
        .expects('saveOrUpdate')
        .withExactArgs(undefined, {
          type: 'password-reset',
          token: sinon.match.string,
          expiresAt: sinon.match.instanceOf(Date),
          userId: USER.id,
        });

      await UserService.sendPasswordResetEmail(EMAIL);

      saveOrUpdate.verify();
    });

    it('should send an email with the password reset URL', async () => {
      sinon.stub(UserRepository, 'findByEmail').resolves(USER);
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves();
      sinon.stub(ChallengeRepository, 'saveOrUpdate').resolves();

      const sendEmail = sinon
        .mock(PostmarkClient)
        .expects('sendEmail')
        .withExactArgs(
          EMAIL,
          sinon.match.number,
          sinon.match({ password_reset_url: sinon.match.string }),
        );

      await UserService.sendPasswordResetEmail(EMAIL);

      sendEmail.verify();
    });
  });

  describe('changePassword', () => {
    it('should change the password', async () => {
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');

      const update = sinon
        .mock(UserRepository)
        .expects('update')
        .withExactArgs(USER.id, { password: 'hashedPassword' });

      await UserService.changePassword(USER.id, 'newPassword');

      update.verify();
    });
  });

  describe('resetPassword', () => {
    const CHALLENGE = {
      token: 'token',
      expiresAt: new Date(Date.now() + 1000),
    } as Challenge;

    it('should reset the password', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves(CHALLENGE);
      sinon.stub(ChallengeRepository, 'update').resolves();
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      sinon.stub(UserService, 'generateAuthToken').returns('authToken');

      await expect(UserService.resetPassword(USER, 'token', PASSWORD)).to.be
        .fulfilled;
    });

    it('should throw an error when the challenge is not found', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves();

      await expect(UserService.resetPassword(USER, 'token', PASSWORD)).to.be
        .rejected;
    });

    it('should throw an error when the token is invalid', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves(CHALLENGE);

      await expect(
        UserService.resetPassword(USER, 'invalidToken', PASSWORD),
      ).to.be.rejectedWith('invalid_token');
    });

    it('should throw an error when the token is expired', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves({
        token: 'token',
        expiresAt: new Date(Date.now() - 1000),
      } as Challenge);

      await expect(
        UserService.resetPassword(USER, 'token', PASSWORD),
      ).to.be.rejectedWith('token_expired');
    });

    it('should throw an error when the password is invalid', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves(CHALLENGE);

      await expect(
        UserService.resetPassword(USER, 'token', 'invalidPassword'),
      ).to.be.rejectedWith('invalid_password');
    });

    it('should change the password', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves(CHALLENGE);
      sinon.stub(ChallengeRepository, 'update').resolves();
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      sinon.stub(UserService, 'generateAuthToken').returns('authToken');

      const changePassword = sinon
        .mock(UserService)
        .expects('changePassword')
        .withExactArgs(USER.id, PASSWORD);

      await UserService.resetPassword(USER, 'token', PASSWORD);

      changePassword.verify();
    });

    it('should return a new auth token', async () => {
      sinon.stub(ChallengeRepository, 'findByUserAndType').resolves(CHALLENGE);
      sinon.stub(ChallengeRepository, 'update').resolves();
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      sinon.stub(UserService, 'generateAuthToken').returns('authToken');

      await expect(UserService.resetPassword(USER, 'token', PASSWORD)).to.be
        .fulfilled;

      expect(
        UserService.resetPassword(USER, 'token', PASSWORD),
      ).to.eventually.deep.equal({ token: 'authToken' });
    });
  });
});

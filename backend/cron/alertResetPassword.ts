import { CronJob } from 'cron';
import { UserService } from '../app/services/UserService';

export const alertResetPassword = new CronJob(
  '0 0 0 * * *', // every day at midnight
  async function () {
    setTimeout(async () => {
      const users = await UserService.findAll();

      console.log('sending password reset email to users');
      // envoyez un email de rappel à chaque utilisateur tout les 60 jours
      for (const user of users) {
        const isVerified = await UserService.verifyAuthToken(user.email);
        if (
          user.resetPasswordAt &&
          user.resetPasswordAt <
            new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) &&
          typeof isVerified === 'object'
        ) {
          await UserService.sendAlertPasswordResetEmail(user.email);
        } else {
          console.log('user is not verified');
        }
      }
    }, 60000);
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Paris', // timeZone
);

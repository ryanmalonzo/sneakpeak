import sinon from 'sinon';
import { PostmarkClient } from '../../app/helpers/postmark';
import { sequelize } from '../../app/models';

before(async () => {
  // Avoid sending emails
  sinon.stub(PostmarkClient, 'sendEmail').resolves();

  await sequelize.authenticate();
  if (process.env.NODE_ENV === 'test') {
    await sequelize.sync({ force: true });
  }
});

after(async () => {
  sinon.restore();
  await sequelize.close();
});

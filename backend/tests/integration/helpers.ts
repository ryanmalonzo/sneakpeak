import { User } from '../../app/models/sql/User';
import { UserService } from '../../app/services/UserService';
import request from 'supertest';
import app from '../../app/index';

export const uniqueEmail = (): string => `test-${Date.now()}@sneakpeak.store`;
export const PASSWORD = 'KaijuHachigou123%';

export async function generateAuthToken() {
  const user: User = await UserService.registerUser(uniqueEmail(), PASSWORD);
  request(app).post('/session').send({
    email: user.email,
    password: PASSWORD,
  });

  console.log(user);
}

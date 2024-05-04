import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

interface User {
  email: string;
  password: string;
};

const SALT_ROUNDS = 10;

const UserSchema: Schema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password as string, SALT_ROUNDS);
  this.password = hash;
  next();
});

export default model('User', UserSchema);

import { model, Schema } from 'mongoose';

interface User {
  email: string;
  password: string;
};

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
});

export default model('User', UserSchema);

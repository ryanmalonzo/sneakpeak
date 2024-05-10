import { Document, Model, model, Schema } from 'mongoose';

interface IResetPasswordToken extends Document {
  userId: number;
  token: string;
  requestAt?: Date;
  expiredAt?: Date;
}

const ResetPasswordTokenSchema: Schema<IResetPasswordToken> = new Schema({
  userId: { type: Number, required: true },
  token: { type: String, required: true },
  requestAt: { type: Date },
  expiredAt: { type: Date },
});

const ResetPasswordTokenModel: Model<IResetPasswordToken> =
  model<IResetPasswordToken>('ResetPasswordToken', ResetPasswordTokenSchema);

export { ResetPasswordTokenModel, IResetPasswordToken };

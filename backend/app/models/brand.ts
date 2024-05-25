import { Document, Model, model, Schema } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  image?: string;
  isBest?: boolean;
  isActive?: boolean;
}

const BrandSchema: Schema<IBrand> = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  isBest: { type: Boolean },
  isActive: { type: Boolean },
});

export const BrandModel: Model<IBrand> = model<IBrand>('Brand', BrandSchema);

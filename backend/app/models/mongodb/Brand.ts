import { Document, Model, model, Schema } from 'mongoose';

interface IBrand extends Document {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema: Schema<IBrand> = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { timestamps: true },
);

const BrandModel: Model<IBrand> = model<IBrand>('Brand', BrandSchema);

export { BrandModel, IBrand };

import { Document, Model, model, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  isBest?: boolean;
  isActive?: boolean;
}

const CategorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  isBest: { type: Boolean },
  isActive: { type: Boolean },
});

export const CategoryModel: Model<ICategory> = model<ICategory>(
  'Category',
  CategorySchema,
);

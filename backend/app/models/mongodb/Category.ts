import { Document, Model, model, Schema } from 'mongoose';

interface ICategory extends Document {
  id: number;
  name: string;
  slug: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

const CategoryModel: Model<ICategory> = model<ICategory>(
  'Category',
  CategorySchema,
);

export { CategoryModel, ICategory };

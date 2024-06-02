import { Document, Model, model, Schema } from 'mongoose';

interface ICategory extends Document {
  id: number;
  name: string;
  slug: string;
}

const CategorySchema: Schema<ICategory> = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

const CategoryModel: Model<ICategory> = model<ICategory>(
  'Category',
  CategorySchema,
);

export { CategoryModel, ICategory };

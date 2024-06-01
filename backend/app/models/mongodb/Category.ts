import { Document, Model, model, Schema } from 'mongoose';

interface ICategory extends Document {
  name: string;
  slug: string;
}

const CategorySchema: Schema<ICategory> = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

const CategoryModel: Model<ICategory> = model<ICategory>(
  'Category',
  CategorySchema,
);

export { CategoryModel, ICategory };

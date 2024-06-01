import { Document, Model, model, Schema } from 'mongoose';

interface ISize extends Document {
  name: string;
  slug: string;
}

const SizeSchema: Schema<ISize> = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

const SizeModel: Model<ISize> = model<ISize>('Size', SizeSchema);

export { SizeModel, ISize };

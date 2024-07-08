import { Document, Model, model, Schema } from 'mongoose';

interface ISize extends Document {
  idRef: number;
  id: number;
  name: string;
  slug: string;
  stock: number;
}

const SizeSchema: Schema<ISize> = new Schema(
  {
    idRef: { type: Number, required: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true },
);

const SizeModel: Model<ISize> = model<ISize>('Size', SizeSchema);

export { SizeModel, ISize };

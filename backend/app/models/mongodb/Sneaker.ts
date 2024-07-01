import { Document, Model, model, Schema } from 'mongoose';
import { IVariant } from './Variant';

interface ISneaker extends Document {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  variants: IVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const SneakerSchema: Schema<ISneaker> = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    variants: [
      {
        stock: { type: Number, required: true },
        image: { type: String, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

const SneakerModel: Model<ISneaker> = model<ISneaker>('Sneaker', SneakerSchema);

export { SneakerModel, ISneaker };

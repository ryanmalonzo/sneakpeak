import { Document, Model, model, Schema } from 'mongoose';
import { IVariant } from './Variant';

interface ISneaker extends Document {
  id: number;
  name: string;
  slug: string;
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
    slug: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    variants: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        isBest: { type: Boolean, required: true },
        sizes: [
          {
            idRef: { type: Number, required: true },
            id: { type: Number, required: true },
            name: { type: String, required: true },
            slug: { type: String, required: true },
            stock: { type: Number, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

const SneakerModel: Model<ISneaker> = model<ISneaker>('Sneaker', SneakerSchema);

export { SneakerModel, ISneaker };

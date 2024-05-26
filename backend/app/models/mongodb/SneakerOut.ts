import { Document, Model, model, Schema } from 'mongoose';

interface ISneaker extends Document {
  reference: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  coverImage: string;
  isBest?: boolean;
  isActive?: boolean;
  colors: {
    name: string;
    image: string;
    sizes: {
      reference: string;
      size: number;
      stock: number;
    }[];
  }[];
}

const SneakerSchema: Schema<ISneaker> = new Schema({
  reference: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  coverImage: { type: String, required: true },
  isBest: { type: Boolean },
  isActive: { type: Boolean },
  colors: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
      sizes: [
        {
          reference: { type: String, required: true, unique: true },
          size: { type: Number, required: true },
          stock: { type: Number, required: true, default: 0 },
        },
      ],
    },
  ],
});

const SneakerModel: Model<ISneaker> = model<ISneaker>('Sneaker', SneakerSchema);

export { SneakerModel, ISneaker };

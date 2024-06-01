import { Document, Model, model, Schema } from 'mongoose';

interface IVariant extends Document {
  stock: number;
  image: string;
  sneakerId: string;
  colorId: string;
}
interface ISneaker extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  variants: IVariant[];
}

const SneakerSchema: Schema<ISneaker> = new Schema({
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
});

const SneakerModel: Model<ISneaker> = model<ISneaker>('Sneaker', SneakerSchema);

export { SneakerModel, ISneaker };

import { Document, Model, model, Schema } from 'mongoose';

interface IVariant extends Document {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  size: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema: Schema<IVariant> = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true },
);

const VariantModel: Model<IVariant> = model<IVariant>('Variant', VariantSchema);

export { VariantModel, IVariant };

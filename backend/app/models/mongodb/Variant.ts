import { Document, Model, model, Schema } from 'mongoose';
import { ISize } from './Size';

interface IVariant extends Document {
  id: number;
  name: string; // a color
  hexCode: string;
  slug: string;
  image: string;
  isBest: boolean;
  sizes: ISize[];
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema: Schema<IVariant> = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    hexCode: { type: String, required: true },
    slug: { type: String },
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
  { timestamps: true },
);

const VariantModel: Model<IVariant> = model<IVariant>('Variant', VariantSchema);

export { VariantModel, IVariant };

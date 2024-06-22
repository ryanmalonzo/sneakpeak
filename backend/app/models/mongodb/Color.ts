import { Document, Model, model, Schema } from 'mongoose';

interface IColor extends Document {
  id: number;
  name: string;
  slug: string;
}

const ColorSchema: Schema<IColor> = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { timestamps: true },
);

const ColorModel: Model<IColor> = model<IColor>('Color', ColorSchema);

export { ColorModel, IColor };

import { Document, Model, model, Schema } from 'mongoose';

interface IColor extends Document {
  name: string;
  slug: string;
}

const ColorSchema: Schema<IColor> = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

const ColorModel: Model<IColor> = model<IColor>('Color', ColorSchema);

export { ColorModel, IColor };

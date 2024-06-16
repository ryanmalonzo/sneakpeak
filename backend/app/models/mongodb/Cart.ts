import { Document, Model, model, Schema } from 'mongoose';

interface ICart extends Document {
  id: number;
  userId: number;
  items: {
    id: number;
    reference: string;
    name: string;
    category: string;
    brand: string;
    mainCover: string;
    quantity: number;
    unitPrice: number;
    adjustement: number;
    total: number;
  }[];
  totalCart: number;
  modifiedAt: Date;
  expiredAt: Date;
}

const CartSchema: Schema<ICart> = new Schema(
  {
    userId: { type: Number, required: true },
    items: [
      {
        id: { type: Number, required: true },
        reference: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
        mainCover: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        adjustement: { type: Number, required: false },
        total: { type: Number, required: true },
      },
    ],
    totalCart: { type: Number, required: true },
    modifiedAt: { type: Date, required: true },
    expiredAt: { type: Date, required: true },
  },
  { timestamps: true },
);

const CartModel: Model<ICart> = model<ICart>('Cart', CartSchema);

export { CartModel, ICart };

import { Document, Model, model, Schema } from 'mongoose';

interface ICart extends Document {
  id: number;
  user: string;
  createdAt: Date;
  updatedAt: Date;
  expiredAt: Date;
  cartProduct: [
    {
      id: number;
      reference: string;
      name: string;
      category: string;
      brand: string;
      image: string;
      quantity: number;
      unitPrice: number;
      adjustement: number;
      total: number;
    },
  ];
}

const CartSchema: Schema<ICart> = new Schema({
  id: { type: Number, required: true },
  user: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date },
  expiredAt: { type: Date, required: true },
  cartProduct: [
    {
      id: { type: Number, required: true },
      reference: { type: String, required: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      brand: { type: String, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      adjustement: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
});

const CartModel: Model<ICart> = model('Cart', CartSchema);

export { CartModel, ICart };

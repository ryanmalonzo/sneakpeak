import { Document, Model, model, Schema } from 'mongoose';

interface ICartItem extends Document {
  id: number;
  reference: string;
  name: string;
  category: string;
  brand: string;
  mainCover: string;
  quantity: number;
  unitPrice: number;
  adjustment?: number;
  total: number;
}

interface ICart extends Document {
  userId: number;
  items: ICartItem[];
  totalCart: number;
  ModifiedAt: Date;
  expiredAt: Date;
}

const CartItemSchema: Schema<ICartItem> = new Schema({
  id: { type: Number, required: true },
  reference: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  mainCover: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  adjustment: { type: Number },
  total: { type: Number, required: true },
});

const CartSchema: Schema<ICart> = new Schema({
  userId: { type: Number, required: true },
  items: [CartItemSchema],
  totalCart: { type: Number, required: true },
  ModifiedAt: { type: Date, required: true },
  expiredAt: { type: Date, required: true },
});

const CartModel: Model<ICart> = model<ICart>('Cart', CartSchema);

export { CartModel, ICart };

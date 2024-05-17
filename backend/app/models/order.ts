import { Document, Model, model, Schema } from 'mongoose';

interface IOrderItem extends Document {
  id: number;
  reference: string;
  name: string;
  category: string;
  brand: string;
  mainCover: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

interface IAddress extends Document {
  postalCode: string;
  street: string;
  city: string;
  phone?: string;
  fullName: string;
}

interface IOrder extends Document {
  userId: string;
  reference: string;
  orderStatus: string;
  paymentStatus: string;
  items: IOrderItem[];
  totalOrder: number;
  shippingAddress: IAddress;
  billingAddress: IAddress;
}

const OrderItemSchema: Schema<IOrderItem> = new Schema({
  id: { type: Number, required: true },
  reference: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  mainCover: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discount: { type: Number },
  total: { type: Number, required: true },
});

const AddressSchema: Schema<IAddress> = new Schema({
  postalCode: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String },
  fullName: { type: String, required: true },
});

const OrderSchema: Schema<IOrder> = new Schema({
  userId: { type: String, required: true },
  reference: { type: String, required: true, unique: true },
  orderStatus: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  items: [OrderItemSchema],
  totalOrder: { type: Number, required: true },
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
});

const OrderModel: Model<IOrder> = model<IOrder>('Order', OrderSchema);

export { OrderModel, IOrder };
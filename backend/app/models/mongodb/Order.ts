import { Document, Schema, Model, model } from 'mongoose';

interface IOrder extends Document {
  id: number;
  total: number;
  status: string;
  payment_status: string;
  reference: string;
  session_id: string;
  invoice_link: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  shipping: {
    street: string;
    city: string;
    phone: string;
    name: string;
    postal_code: string;
  };
  billing: {
    address: string;
    city: string;
    postal_code: string;
  };
  orderProduct: [
    {
      id: number;
      reference: string;
      name: string;
      color: string;
      size: string;
      category: string;
      brand: string;
      image: string;
      stock: number;
      quantity: number;
      unitPrice: number;
      adjustment: number;
      total: number;
    },
  ];
}

const OrderSchema: Schema<IOrder> = new Schema({
  id: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, required: true },
  payment_status: { type: String, required: true },
  reference: { type: String, required: true },
  session_id: { type: String, required: true },
  invoice_link: { type: String },
  user: {
    id: { type: Number, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  createdAt: { type: Date, required: true },
  shipping: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    phone: { type: String, required: false },
    name: { type: String, required: false },
    postal_code: { type: String, required: false },
  },
  billing: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    phone: { type: String, required: false },
    name: { type: String, required: false },
    postal_code: { type: String, required: false },
  },

  orderProduct: [
    {
      id: { type: Number, required: false },
      reference: { type: String, required: false },
      color: { type: String, required: false },
      size: { type: String, required: false },
      name: { type: String, required: false },
      category: { type: String, required: false },
      brand: { type: String, required: false },
      image: { type: String, required: false },
      stock: { type: Number, required: false },
      quantity: { type: Number, required: false },
      unitPrice: { type: Number, required: false },
      adjustment: { type: Number, required: false },
      total: { type: Number, required: false },
    },
  ],
});

const OrderModel: Model<IOrder> = model('Order', OrderSchema);

export { OrderModel, IOrder };

import { Document, Schema, Model, model } from 'mongoose';

interface IOrder extends Document {
  id: number;
  total: number;
  status: string;
  payment_status: string;
  reference: string;
  session_id: string;
  invoice_link: string;
  amount_refunded: number;
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
    street: string;
    city: string;
    phone: string;
    name: string;
    postal_code: string;
  };
  orderProduct: [
    {
      id: number;
      color: string;
      size: string;
      name: string;
      category: string;
      isRefund: boolean;
      brand: string;
      image: string;
      stock: number;
      quantity: number;
      unitPrice: number;
      productReturn: {
        id: number;
        order_product_id: number;
        reason: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
      };
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
  invoice_link: { type: String, required: false },
  amount_refunded: { type: Number, required: false },
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
      id: { type: Number, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      isRefund: { type: Boolean, required: true },
      brand: { type: String, required: true },
      image: { type: String, required: true },
      stock: { type: Number, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      productReturn: {
        id: { type: Number, required: true },
        order_product_id: { type: Number, required: true },
        reason: { type: String, required: true },
        status: { type: String, required: true },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
      },
    },
  ],
});

const OrderModel: Model<IOrder> = model('Order', OrderSchema);

export { OrderModel, IOrder };

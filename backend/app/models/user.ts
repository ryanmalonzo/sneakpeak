import { Model, model, Schema } from 'mongoose';

interface IUser {
  email: string;
  password: string;
  challenge: {
    email: {
      verified: boolean;
      token: string;
      expiresAt: Date;
    };
    passwordReset: {
      token: string;
      expiresAt: Date;
    };
  };
  firstName?: string;
  lastName?: string;
  phone?: string;
  roles?: string[];
  shippingAddresses?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  billingAddresses?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    challenge: {
      email: {
        verified: {
          type: Boolean,
          default: false,
        },
        token: {
          type: String,
        },
        expiresAt: {
          type: Date,
        },
      },
      passwordReset: {
        token: {
          type: String,
        },
        expiresAt: {
          type: Date,
        },
      },
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
    },
    roles: {
      type: [String],
      default: ['ROLE_USER'],
    },
    shippingAddresses: [
      {
        street: {
          type: String,
        },
        city: {
          type: String,
        },
        postalCode: {
          type: String,
        },
        country: {
          type: String,
        },
        isDefault: {
          type: Boolean,
        },
      },
    ],
    billingAddresses: [
      {
        street: {
          type: String,
        },
        city: {
          type: String,
        },
        postalCode: {
          type: String,
        },
        country: {
          type: String,
        },
        isDefault: {
          type: Boolean,
        },
      },
    ],
  },
  { timestamps: true },
);

const UserModel: Model<IUser> = model<IUser>('User', UserSchema);
export { UserModel, IUser };

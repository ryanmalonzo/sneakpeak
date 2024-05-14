import { Document, Model, model, Schema } from 'mongoose';

interface INewsletterSubscription extends Document {
  email: string;
  isRestockActive?: boolean;
  isNewPriceActive?: boolean;
  isNewsletterActive?: boolean;
  isNewProductActive?: boolean;
}

const NewsletterSubscriptionSchema: Schema<INewsletterSubscription> =
  new Schema({
    email: { type: String, required: true, unique: true },
    isRestockActive: { type: Boolean },
    isNewPriceActive: { type: Boolean },
    isNewsletterActive: { type: Boolean },
    isNewProductActive: { type: Boolean },
  });

const NewsletterSubscriptionModel: Model<INewsletterSubscription> =
  model<INewsletterSubscription>(
    'NewsletterSubscription',
    NewsletterSubscriptionSchema,
  );

export { NewsletterSubscriptionModel, INewsletterSubscription };

import mongoose from 'mongoose';
import { BrandModel } from '../models/mongodb/Brand';
import { CategoryModel } from '../models/mongodb/Category';
import { SneakerModel } from '../models/mongodb/Sneaker';
import { VariantModel } from '../models/mongodb/Variant';
import { CartModel } from '../models/mongodb/Cart';
import { ColorModel } from '../models/mongodb/Color';
import { SizeModel } from '../models/mongodb/Size';
import { OrderModel } from '../models/mongodb/Order';

// Operation type
export type Operation = 'create' | 'update' | 'delete';

// Sync data with MongoDB database
async function syncWithMongoDB(
  modelName: string,
  operation: Operation,
  data: object,
) {
  // Create a new model instance
  const ModelMongo = mongoose.model(modelName, getModel(modelName).schema);

  // Perform the operation
  switch (operation) {
    case 'create': {
      // Create a new document
      const newDocument = new ModelMongo({
        _id: new mongoose.Types.ObjectId(),
        ...data,
      });
      // Save the document
      await newDocument.save();
      break;
    }
    case 'update': {
      // Update the document
      if (!('id' in data)) {
        throw new Error('The document ID is required to update the document.');
      }
      await ModelMongo.findOneAndUpdate({ id: data.id }, data);
      break;
    }
    case 'delete': {
      // Delete the document
      if (!('id' in data)) {
        throw new Error('The document ID is required to delete the document.');
      }
      await ModelMongo.findOneAndDelete({ id: data.id });
      break;
    }
    default: {
      // Throw an error
      throw new Error(`Unsupported operation type: ${operation}`);
    }
  }
}

// Get the model by name
function getModel(modelName: string) {
  switch (modelName) {
    case 'Brand':
      return BrandModel;
    case 'Category':
      return CategoryModel;
    case 'Color':
      return ColorModel;
    case 'Size':
      return SizeModel;
    case 'Sneaker':
      return SneakerModel;
    case 'Variant':
      return VariantModel;
    case 'Cart':
      return CartModel;
    case 'Order':
      return OrderModel;
    default:
      throw new Error(`Unsupported model name: ${modelName}`);
  }
}

export default syncWithMongoDB;

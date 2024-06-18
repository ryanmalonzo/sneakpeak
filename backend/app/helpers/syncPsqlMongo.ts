import mongoose from 'mongoose';
import { BrandModel } from '../models/mongodb/Brand';
import { CategoryModel } from '../models/mongodb/Category';
import { SneakerModel } from '../models/mongodb/Sneaker';
import { CartModel } from '../models/mongodb/Cart';

// Operation type
type Operation = 'create' | 'update' | 'delete';

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
      console.log('Updating the document:', data);
      await ModelMongo.findOneAndUpdate({ id: data.id }, data);
      break;
    }
    case 'delete': {
      // Delete the document
      if (!('id' in data)) {
        throw new Error('The document ID is required to delete the document.');
      }
      console.log('Deleting the document:', data);
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
    case 'Sneaker':
      return SneakerModel;
    case 'Cart':
      return CartModel;
    default:
      throw new Error(`Unsupported model name: ${modelName}`);
  }
}

export default syncWithMongoDB;

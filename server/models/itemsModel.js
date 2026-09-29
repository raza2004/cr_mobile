import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  image: {
    type: String,
    required: [true, 'Please add an image'],
  },
  categories: {
    type: [String],
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemComment: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.models.itemsClient || mongoose.model('itemsClient', ItemSchema);

// moodboardsModel.js
import mongoose from 'mongoose';

const MoodboardSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, 
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  comments: {
    type: String,
    // required: true,
  },
  
});

const Moodboard = mongoose.models.Moodboard || mongoose.model('Moodboard', MoodboardSchema);

export default Moodboard;

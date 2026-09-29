import mongoose from 'mongoose';

const PresentationSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    // required: true,
  },
  clientName: {
    type: String,
    // required: true,
  },
  clientEmail: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  text: {
    type: String,
    // required: true,
  },
  sharedWithClient: {
    type: Boolean
  },
  boards: {
    type: Array,
  },
  currentBoard: {
    type: Number,
    // required: true,
  },
  layoutType: {
    type: String,
  },
  
}, { timestamps: true });

const Presentation = mongoose.models.Presentation || mongoose.model('Presentation', PresentationSchema);

export default Presentation;

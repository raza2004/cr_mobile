import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User (stylist or client)
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User (stylist or client)
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },  // Add status field with default 'sent'
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);

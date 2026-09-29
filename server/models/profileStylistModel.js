import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String },
  user_email: { type: String, required: true }
});

const Profile = mongoose.models.profiles || mongoose.model('profiles', ProfileSchema);

export default Profile;

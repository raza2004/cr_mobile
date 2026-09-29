import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  userFullName: {
    type: String,
    required: [true, "Please provide your full name"],
  },

  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide your number"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minlength: 6,
  },
  isVerifiedemail: {
    type: Boolean,
    default: false,
  },
 
  isAdmin: {
    type: Boolean,
    default: false,
  },

  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyEmailToken: String,
  verifyEmailTokenExpiry: Date,
  
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
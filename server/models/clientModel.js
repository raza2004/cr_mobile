import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
  },
  stylist: {
    type: String,
  },
  image: {
    type: String,
  },
  fullName: {
    type: String,
  },
  age: {
    type: Number,
  },
  height: {
    type: Number,
  },
  footSize: {
    type: Number,
  },
  shoulders: {
    type: Number,
  },
  waist: {
    type: Number,
  },
  breast: {
    type: Number,
  },
  hips: {
    type: Number,
  },
  favoriteColors: {
    type: String,
  },
  tabooColors: {
    type: String,
  },
  neverWear: {
    type: String,
  },
  rhythmOfLife: {
    type: String,
  },
  preferredShoes: {
    type: String,
  },
  dreamOutfit: {
    type: String,
  },
  needWeekendItems: {
    type: String,
  },
  influencersStyle: {
    type: String,
  },
  favoriteBrands: {
    type: String,
  },
  priceSegment: {
    type: String,
  },
  expectations: {
    type: String,
  },
  password: {
    type: String,
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
  isInvited: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Client = mongoose.models.clients || mongoose.model("clients", clientSchema);

export default Client;

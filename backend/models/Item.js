import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["clothing", "accessories", "shoes", "other"],
    default: "other",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "",
  },
  brand: {
    type: String,
    default: "",
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Item", itemSchema);

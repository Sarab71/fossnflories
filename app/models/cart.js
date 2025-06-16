import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  modelNumber: { type: String, required: true },
  images: [
    {
      publicId: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming a User model exists
    required: true,
    unique: true, // ensures one cart per user
  },
  products: [cartProductSchema], // Array of product objects with quantity
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  modelNumber: { type: String, required: true },
  category: { type: [String], required: true },
  images: [
    {
      publicId: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;

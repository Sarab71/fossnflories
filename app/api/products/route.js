import connectToDatabase from '../../../lib/mongodb';
import Product from '@/app/models/product'; // Correct path for your Product model
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to Cloudinary
export const uploadToCloudinary = async (base64Image) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'products', // Change folder name as required
    });

    return {
      publicId: uploadResponse.public_id,
      url: uploadResponse.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Error uploading images to Cloudinary');
  }
};

// POST endpoint to create a new product
export const POST = async (req) => {
  try {
    const { name, price, description, modelNumber, images, category } = await req.json();

    console.log('Received data:', { name, price, description, modelNumber, images, category });

    // Ensure images are an array and validate the format
    if (!Array.isArray(images) || !images.every(image => image.publicId && image.url)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid image format' }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Save product to the database
    const newProduct = new Product({
      name,
      price,
      description,
      modelNumber,
      images, // The images should be an array of objects with publicId and url
      category,
    });

    const result = await newProduct.save();

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error creating product', error: error.message }),
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const db = await connectToDatabase();
    if (!db) {
      throw new Error('Database connection failed');
    }
    const products = await db.collection('products').find({}).toArray();
    return new Response(JSON.stringify({ success: true, data: products }), { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
};


export const PUT = async (req) => {
  try {
    const url = new URL(req.url); 
    const id = url.searchParams.get('id'); // Extract 'id' from query params

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Product ID is required' }), { status: 400 });
    }

    const { name, price, description, modelNumber, images, category } = await req.json();

    // Ensure images are an array and validate the format
    if (!Array.isArray(images) || !images.every(image => image.publicId && image.url)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid image format' }),
        { status: 400 }
      );
    }

    // Ensure category is an array
    if (!category || !Array.isArray(category)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Category should be an array' }),
        { status: 400 }
      );
    }

    // Ensure database connection
    await connectToDatabase();

    // Update the product in MongoDB
    const result = await Product.findByIdAndUpdate(
      id,
      { name, price, description, modelNumber, images, category }, // Include modelNumber and images in the update
      { new: true } // Return the updated document
    );

    if (!result) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product not found' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Product updated successfully',
        data: result,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PUT request:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error updating product', error: error.message }),
      { status: 500 }
    );
  }
};


export const DELETE = async (req) => {
  try {
    const url = new URL(req.url); 
    const id = url.searchParams.get('id'); // Extract 'id' from query params

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Product ID is required' }), { status: 400 });
    }

    await connectToDatabase(); // Ensure database connection

    // Delete the product from MongoDB
    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return new Response(JSON.stringify({ success: false, message: 'Product not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Product deleted successfully', data: result }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error deleting product', error: error.message }),
      { status: 500 }
    );
  }
};


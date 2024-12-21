import connectToDatabase from '../../../lib/mongodb';
import Product from '@/app/models/product'; // Correct path for your Product model

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

export const POST = async (req) => {
  try {
    const { name, price, description, modelNumber, images, category } = await req.json();

    console.log("Received data:", { name, price, description, modelNumber, images, category });

    if (!Array.isArray(category) || category.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Category must be a non-empty array' }),
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newProduct = new Product({
      name,
      price,
      description,
      modelNumber,
      images,
      category // Now supports array
    });

    const result = await newProduct.save();

    return new Response(
      JSON.stringify({
        success: true,
        data: result
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error creating product', error: error.message }),
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const url = new URL(req.url); 
    const id = url.searchParams.get('id'); // Extract 'id' from query params

    if (!id) {
      return new Response(JSON.stringify({ success: false, message: 'Product ID is required' }), { status: 400 });
    }

    const { name, price, description, category, images } = await req.json();

    if (!category || !Array.isArray(category)) {
      return new Response(JSON.stringify({ success: false, message: 'Category is required and should be an array' }), { status: 400 });
    }

    // Ensure database connection
    await connectToDatabase();

    // Update the product in MongoDB
    const result = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category, images }, // Include category and images in the update
      { new: true } // Return the updated document
    );

    if (!result) {
      return new Response(JSON.stringify({ success: false, message: 'Product not found' }), { status: 404 });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Product updated successfully', data: result }),
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


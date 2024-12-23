import Product from "@/app/models/product";
import connectToDatabase from "@/lib/mongodb";


export const GET = async (req, { params }) => {
  try {
    await connectToDatabase(); // Ensure the database is connected

    // Await the `params` to destructure its properties
    const { id } = await params;

    // Fetch the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return new Response(
        JSON.stringify({ success: false, message: 'Product not found.' }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: product }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error fetching product', error: error.message }),
      { status: 500 }
    );
  }
};

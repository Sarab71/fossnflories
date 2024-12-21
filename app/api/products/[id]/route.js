import Product from "@/app/models/product";
import connectToDatabase from "@/lib/mongodb";


export async function GET(req, { params }) {
  await connectToDatabase(); // Ensure the database is connected

  const { id } = params; // Extract product ID from URL params

  try {
    const product = await Product.findById(id); // Fetch product by ID

    if (!product) {
      return new Response(
        JSON.stringify({ success: false, message: "Product not found" }),
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
      JSON.stringify({ success: false, message: "Server Error" }),
      { status: 500 }
    );
  }
}

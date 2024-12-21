import connectToDatabase from "@/lib/mongodb";

export const GET = async (request) => {
  try {
    const db = await connectToDatabase();
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Extract query parameter for categories
    const url = new URL(request.url);
    const categories = url.searchParams.get('categories'); // Expect comma-separated values

    let filter = {};
    if (categories) {
      const categoryArray = categories.split(',').map((category) => category.trim());
      filter = { category: { $in: categoryArray } }; // MongoDB $in for matching multiple categories
    }

    // Fetch products based on the category filter
    const products = await db.collection('products').find(filter).toArray();

    return new Response(
      JSON.stringify({ success: true, data: products }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

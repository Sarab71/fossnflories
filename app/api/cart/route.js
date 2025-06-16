import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "../../../lib/mongodb";
import Cart from "../../models/cart";
import User from "../../models/user"; // Assuming you have a User model

// 📌 GET Cart
export async function GET(req) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response("User not found", { status: 404 });

  const cart = await Cart.findOne({ userId: user._id });
  return Response.json(cart || { products: [] });
}

// 📌 ADD to Cart
export async function POST(req) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response("User not found", { status: 404 });

  const { productId, name, price, modelNumber, images, quantity } = await req.json();

  let cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    cart = new Cart({ userId: user._id, products: [] });
  }

  if (!cart.products) {
    cart.products = [];
  }

  const existingProduct = cart.products.find((item) =>
    item.productId.toString() === productId
  );

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({
      productId,
      name,
      price,
      modelNumber,
      images,
      quantity,
    });
  }
  await cart.save();
  return Response.json({ success: true, cart });
}

// 📌 REMOVE from Cart
export async function DELETE(req) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response("User not found", { status: 404 });

  const { productId } = await req.json();
  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) return new Response("Cart not found", { status: 404 });

  cart.products = cart.products.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  return Response.json({ success: true, cart });
}

// 📌 UPDATE Quantity
export async function PUT(req) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response("User not found", { status: 404 });

  const { productId, quantity } = await req.json();

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart) return new Response("Cart not found", { status: 404 });

  const product = cart.products.find(
    (item) => item.productId.toString() === productId
  );

  if (product) {
    product.quantity = quantity;
    await cart.save();
    return Response.json({ success: true, cart });
  }

  return new Response("Product not found in cart", { status: 404 });
}

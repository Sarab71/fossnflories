"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartPage = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total); // ✅ ab ye error nahi dega
  }, [cart]);

  // 🔄 Fetch Cart from Server
  useEffect(() => {
    const fetchCart = async () => {
      if (!session) return;

      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        setCart(data.products || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [session]);


  // ➕ Increase quantity
  const handleIncrease = async (productId, currentQty) => {
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: currentQty + 1 }),
    });

    const data = await res.json();
    setCart(data.cart.products || []);
  };

  // ➖ Decrease quantity or remove
  const handleDecrease = async (productId, currentQty) => {
    if (currentQty === 1) {
      handleRemove(productId);
      return;
    }

    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: currentQty - 1 }),
    });

    const data = await res.json();
    setCart(data.cart.products || []);
  };

  // ❌ Remove from cart
  const handleRemove = async (productId) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    setCart(data.cart.products || []);
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cart.map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                {product.images?.[0]?.url && (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded"
                  />
                )}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 mb-2">₹{product.price}</p>

                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => handleDecrease(product.productId, product.quantity)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-lg font-medium">{product.quantity}</span>
                    <button
                      onClick={() => handleIncrease(product.productId, product.quantity)}
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(product.productId)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <hr className="my-6 border-t border-gray-300" />
          {/* ✅ Total Price Section */}
          <div className="mt-6 text-center md:text-right ">
            <h3 className="text-lg font-semibold">Total Price</h3>
            <p className="text-xl font-bold">₹{totalPrice.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>

  );
};

export default CartPage;

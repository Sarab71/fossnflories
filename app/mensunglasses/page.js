'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const Sunglasses = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Create an instance of useRouter

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/productsByCategory?categories=MenSunglasses,UnisexSunglasses');
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        } else {
          console.error('Error fetching products:', result.message);
        }
      } catch (error) {
        console.error('Error in API call:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    if (id) {
      router.push(`/products/${id}`); // Navigate to the product details page
    } else {
      console.error('Product ID is undefined');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Men Sunglasses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="border rounded-md p-4 shadow hover:shadow-lg transition cursor-pointer" // Added cursor-pointer
              onClick={() => handleProductClick(product._id)} // Added onClick handler
              role="button" // Add role for better accessibility
              tabIndex={0} // Make the card focusable
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleProductClick(product._id);
              }} // Allow navigation with keyboard
            >
              <img
                src={product.image || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-blue-500 font-bold">₹{product.price}</p>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Sunglasses;

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import Banner from './components/Banner';
import WhatsAppButton from './components/WhatsappButton';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const router = useRouter(); // Create an instance of useRouter

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Replace with your API endpoint
        const data = await response.json();

        if (data.success) {
          setProducts(data.data); // Assuming 'data.data' contains the products
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, []);

  // Onclick handler for navigating to the product details page
  const handleProductClick = (id) => {
    if (id) {
      router.push(`/products/${id}`); // Navigate to the product details page with product ID
    } else {
      console.error('Product ID is undefined');
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-lg font-semibold text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      {/* Banner Component */}
      <Banner />
     <WhatsAppButton/>
      {/* Product Section */}
      <div className="max-w-screen-lg mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-all cursor-pointer"
              onClick={() => handleProductClick(product._id)} // Add onClick handler
              role="button" // Add role for better accessibility
              tabIndex={0} // Make the card focusable
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleProductClick(product._id);
              }} // Allow navigation with keyboard
            >
              <img
                src={product.images[0]?.url} // Assuming the first image in the array
                alt={product.name}
                className="w-full h-48 object-cover" // Adjusted image height
              />
              <div className="p-3"> {/* Reduced padding */}
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p> {/* Ensure consistent description length */}
                <div className="flex justify-between items-center mt-4">
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  
};

export default ProductsPage;

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Import useParams for dynamic routes

const ProductPage = () => {
  const [product, setProduct] = useState(null); // State to hold product data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Manage currently displayed image index

  const { id } = useParams(); // Extract product ID from URL
  const router = useRouter(); // For navigation and error handling

  useEffect(() => {
    if (!id) {
      setError('Invalid Product ID'); // Handle invalid ID scenario
      setLoading(false);
      return;
    }

    // Fetch product details
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.data); // Set product data
        } else {
          throw new Error(data.message || 'Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProduct();
  }, [id]);

  // Generate WhatsApp Message Link
  const generateWhatsAppLink = () => {
    const productLink = `${window.location.origin}/products/${id}`; // Construct product link
    const message = `Hi, I'm interested in this product: ${product.name}.\nCheck it here: ${productLink}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`; // WhatsApp URL with message
  };

  // Handle image navigation
  const handleImageNavigation = (direction) => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => {
        if (direction === 'prev') {
          return prevIndex === 0 ? product.images.length - 1 : prevIndex - 1; // Loop to last image
        } else if (direction === 'next') {
          return prevIndex === product.images.length - 1 ? 0 : prevIndex + 1; // Loop to first image
        }
      });
    }
  };

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-lg font-semibold text-red-500">
        Error: {error}
        <button
          onClick={() => router.push('/products')} // Navigate back to the product listing page
          className="block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">{product.name}</h1>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Carousel */}
        <div className="relative">
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[currentImageIndex]} // Display the current image
              alt={product.name}
              className="w-full h-[350px] md:h-[500px] object-cover rounded-lg transition-all duration-300"
            />
          )}
        </div>

        {/* Arrows outside the image container */}
        <div className="absolute top-1/2 left-5 transform -translate-y-1/2 md:left-[-50px]">
          <button
            onClick={() => handleImageNavigation('prev')}
            className="bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
          >
            &#60;
          </button>
        </div>
        <div className="absolute top-1/2 right-5 transform -translate-y-1/2 md:right-[410px] md:w-1/12">
          <button
            onClick={() => handleImageNavigation('next')}
            className="bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100"
          >
            &#62;
          </button>
        </div>

        <div>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-gray-800 mb-4">₹{product.price}</p>
          <a
            href={generateWhatsAppLink()} // WhatsApp link
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Click Here to Buy on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = "/api/products";

const categoriesList = [
  "MenFrames",
  "MenSunglasses",
  "WomenFrames",
  "WomenSunglasses",
  "KidsFrames",
  "KidsSunglasses",
  "UnisexFrames",
  "UnisexSunglasses",
];

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    modelNumber: "",
    images: "",
    category: [],
  });

  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setProducts(data.data);
        toast.success("Products loaded successfully");
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  const handleCreate = async () => {
    // Ensure images are split into an array properly and trimmed
    const formattedImages = newProduct.images
      ? newProduct.images
          .split(",")  // Split by commas
          .map((img) => img.trim())  // Trim any extra spaces
          .filter((img) => img !== "")  // Remove empty strings
      : []; // Default to an empty array if no images

    // Ensure category is a valid array
    const formattedCategory = Array.isArray(newProduct.category)
      ? newProduct.category
      : [];

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          images: formattedImages,  // Pass the correct images array
          category: formattedCategory,
        }),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const data = await res.json();
      setNewProduct({
        name: "",
        price: 0,
        description: "",
        modelNumber: "",
        images: "",
        category: [],
      });
      toast.success("Product added successfully!");

      // After product is added, fetch the updated products list
      const fetchUpdatedProducts = async () => {
        try {
          const res = await fetch(apiUrl);
          const data = await res.json();
          setProducts(data.data);
        } catch (error) {
          console.error("Error fetching updated products:", error);
          toast.error("Failed to load updated products");
        }
      };

      fetchUpdatedProducts(); // Update the product list
    } catch (error) {
      console.error("Error creating product:", error.message);
      toast.error(`Error creating product: ${error.message}`);
    }
  };


  const handleEdit = (id) => {
    const productToEdit = products.find((product) => product._id === id);
  
    if (!productToEdit) {
      console.error("Product not found with ID:", id);
      return;
    }
  
    setNewProduct({
      name: productToEdit.name || "",
      price: productToEdit.price || "",
      description: productToEdit.description || "",
      modelNumber: productToEdit.modelNumber || "",
      images: Array.isArray(productToEdit.images)
        ? productToEdit.images.join(", ")  // If images are already an array, join them into a comma-separated string for editing
        : "", // Safe check for images
      category: productToEdit.category || [],
    });
  
    setEditProduct(productToEdit._id); // Set the product being edited
  };
  

  const handleUpdate = async () => {
    // Ensure price is a valid number and round it to 2 decimal places
    const validPrice = parseFloat(newProduct.price);
  
    // Validate price, make sure it's a positive number and not NaN
    if (isNaN(validPrice) || validPrice <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
  
    setNewProduct({ ...newProduct, price: validPrice });
  
    // Ensure images are in array format
    const updatedImages = newProduct.images
      .split(",")
      .map((image) => image.trim()) // Split string by commas and remove extra spaces around the image URLs
      .filter((image) => image !== ""); // Filter out any empty strings
  
    try {
      const res = await fetch(`/api/products?id=${editProduct}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...newProduct, 
          price: validPrice,
          images: updatedImages, // Send images as an array
        }),
      });
  
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || "Failed to update product");
      }
  
      // After updating the product, fetch the updated products list
      const fetchUpdatedProducts = async () => {
        try {
          const res = await fetch(apiUrl);
          const data = await res.json();
          setProducts(data.data);
        } catch (error) {
          console.error("Error fetching updated products:", error);
          toast.error("Failed to load updated products");
        }
      };
  
      fetchUpdatedProducts(); // Update the product list
      toast.success("Product updated successfully!");
      setEditProduct(null); // Clear edit state after successful update
    } catch (error) {
      console.error("Error updating product:", error.message);
      toast.error(`Error updating product: ${error.message}`);
    }
  };
  

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((product) => product._id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error.message);
      toast.error(`Failed to delete product: ${error.message}`);
    }
  };

  const handleCategoryChange = (category) => {
    const selectedCategories = newProduct.category.includes(category)
      ? newProduct.category.filter((c) => c !== category)
      : [...newProduct.category, category];
    setNewProduct({ ...newProduct, category: selectedCategories });
  };

  return (
    <div className="container p-6 mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-semibold mb-6">Admin Panel</h1>

      {/* Create or Update Product Form */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">
          {editProduct ? "Update Product" : "Add New Product"}
        </h2>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border p-3 mb-4 w-full"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              price: parseFloat(e.target.value) || "",
            })
          }
          onWheel={(e) => e.target.blur()} // Prevent scroll effect
          className="border p-3 mb-4 w-full"
        />

        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="border p-3 mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Model Number"
          value={newProduct.modelNumber}
          onChange={(e) =>
            setNewProduct({ ...newProduct, modelNumber: e.target.value })
          }
          className="border p-3 mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Image URLs (comma separated)"
          value={newProduct.images}
          onChange={(e) =>
            setNewProduct({ ...newProduct, images: e.target.value })
          }
          className="border p-3 mb-4 w-full"
        />

        {/* Multi-Select Dropdown for Categories */}
        <div className="mb-4">
          <label className="block text-lg mb-2">Select Categories:</label>
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newProduct.category.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={editProduct ? handleUpdate : handleCreate}
          className="bg-blue-500 text-white p-3 rounded w-full"
        >
          {editProduct ? "Update Product" : "Create Product"}
        </button>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="border p-4">
              <h3 className="text-xl mb-2">{product.name}</h3>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="font-bold">₹{product.price}</p>
              <button
                onClick={() => handleEdit(product._id)}
                className="bg-yellow-500 text-white p-2 rounded mt-4 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white p-2 rounded mt-4"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;

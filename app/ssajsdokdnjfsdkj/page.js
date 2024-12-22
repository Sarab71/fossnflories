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
    images: [],
    category: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]); // State to hold the image previews
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
        ? productToEdit.images.join(", ") // If images are already an array, join them into a comma-separated string for editing
        : "", // Safe check for images
      category: productToEdit.category || [],
    });

    setImagePreviews(productToEdit.images.map((image) => image.url)); // Set preview URLs for images
    setEditProduct(productToEdit._id); // Set the product being edited
  };

  // Function to handle image upload to Cloudinary
  const uploadImagesToCloudinary = async (images) => {
    try {
      const uploadedImages = [];
      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "FossNFlories"); // Replace with your Cloudinary preset

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/du9zrisyt/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        if (result.secure_url) {
          uploadedImages.push({
            publicId: result.public_id,
            url: result.secure_url,
          });
        }
      }
      return uploadedImages;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload images");
      return [];
    }
  };

  const handleCreate = async () => {
    const formattedImages = newProduct.images.length
      ? await uploadImagesToCloudinary(newProduct.images)
      : [];

    const formattedCategory = Array.isArray(newProduct.category)
      ? newProduct.category
      : [];

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          images: formattedImages,
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
        images: [],
        category: [],
      });
      setImagePreviews([]); // Clear previews after successful creation
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

  const handleUpdate = async () => {
    const validPrice = parseFloat(newProduct.price);
    if (isNaN(validPrice) || validPrice <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    setNewProduct({ ...newProduct, price: validPrice });

    const updatedImages = await uploadImagesToCloudinary(newProduct.images);
    const formattedCategory = Array.isArray(newProduct.category)
      ? newProduct.category
      : [];

    try {
      const res = await fetch(`/api/products?id=${editProduct}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: validPrice,
          images: updatedImages,
          category: formattedCategory,
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

      fetchUpdatedProducts();
      toast.success("Product updated successfully!");
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error.message);
      toast.error(`Error updating product: ${error.message}`);
    }
  };

  const handleCategoryChange = (category) => {
    const selectedCategories = newProduct.category.includes(category)
      ? newProduct.category.filter((c) => c !== category)
      : [...newProduct.category, category];
    setNewProduct({ ...newProduct, category: selectedCategories });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct({ ...newProduct, images: files });

    // Update image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    <div className="container p-6 mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-semibold mb-6">Admin Panel</h1>

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

        <div className="mb-4">
          <input type="file" multiple onChange={handleImageChange} />
        </div>

        <div className="mb-4">
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt="Preview"
                  className="w-full h-32 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          {categoriesList.map((category) => (
            <label key={category} className="block">
              <input
                type="checkbox"
                checked={newProduct.category.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              {category}
            </label>
          ))}
        </div>

        <button
          onClick={editProduct ? handleUpdate : handleCreate}
          className="bg-blue-500 text-white py-2 px-4"
        >
          {editProduct ? "Update Product" : "Add Product"}
        </button>
      </div>

      <div>
        <h2 className="text-2xl mb-4">All Products</h2>
        {products.map((product) => (
          <div key={product._id} className="border p-4 mb-4">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <button
              onClick={() => handleEdit(product._id)}
              className="bg-yellow-500 text-white py-2 px-4 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product._id)}
              className="bg-red-500 text-white py-2 px-4"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;

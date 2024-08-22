import React, { useEffect, useState } from "react";
import axios from "axios";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(""); // State to store the success message
  const token = localStorage.getItem("adminToken");
  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://backend-uhub.onrender.com/api/admin/allproducts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to delete a product
  const deleteProduct = async (productId) => {
    try {
      await axios.post(
        "https://backend-uhub.onrender.com/api/admin/deleteproduct",
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(products.filter((product) => product._id !== productId));

      // Set the success message and clear it after 3 seconds
      setMessage("Product deleted successfully!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-md shadow-md">
            <img
              src={`https://backend-uhub.onrender.com/${product.image}`}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>

            <button
              onClick={() => deleteProduct(product._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;

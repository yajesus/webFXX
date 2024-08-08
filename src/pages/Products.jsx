import React, { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (err) {
        setError("Error fetching products");
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleStartNow = async () => {
    const token = localStorage.getItem("token");
    const currentProduct = products[currentProductIndex];
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/submit-task",
        {
          userId: userId,
          productId: currentProduct._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Balance updated successfully");
      setError("");
      setTimeout(() => setSuccess(""), 3000);

      // Move to the next product
      setCurrentProductIndex((prevIndex) => prevIndex + 1);
      setProgress((prevProgress) => prevProgress + 1);
    } catch (err) {
      let errorMessage = "An error occurred";
      console.log(err);
      // Check for error response and format message
      if (err.response) {
        if (err.response.data && typeof err.response.data === "object") {
          errorMessage = err.response.data.message || "An error occurred";
        } else if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);

      setSuccess("");
      setTimeout(() => setError(""), 3000);
      console.error(err);
    }
  };

  return (
    <div className="w-full h-[800px]  mx-auto mt-20 px-4">
      <div className="w-full flex justify-center">
        <p className="text-4xl text-blue-600 font-bold">Boost Mission</p>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          {success}
        </div>
      )}
      {products.length > 0 && currentProductIndex < products.length ? (
        <div className="border p-3 rounded shadow-md max-w-md mx-auto mt-6">
          <h3 className="text-lg font-semibold">
            {products[currentProductIndex].name}
          </h3>
          <p className="text-sm mt-1">
            {products[currentProductIndex].description}
          </p>
          {products[currentProductIndex].image && (
            <img
              src={`http://localhost:5000/${products[currentProductIndex].image}`}
              alt={products[currentProductIndex].name}
              className="w-full h-auto mt-3 rounded"
            />
          )}
          <p className="text-sm mt-2">
            Price: ${products[currentProductIndex].price}
          </p>
          <p className="text-sm">
            Profit: ${products[currentProductIndex].profit}
          </p>
          <p className="text-sm">
            Premium: {products[currentProductIndex].isPremium ? "Yes" : "No"}
          </p>
        </div>
      ) : (
        <p>No more products to show</p>
      )}
      <div className="w-full flex justify-center">
        <button
          onClick={handleStartNow}
          className=" w-[60%] h-20 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4 text-3xl font-bold"
        >
          Start Now ({progress}/{products.length})
        </button>
      </div>
    </div>
  );
};

export default Products;

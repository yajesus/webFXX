import React, { useEffect, useState } from "react";
import axios from "axios";

const Alltraningproducts = () => {
  const [trainingProducts, setTrainingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchTrainingProducts = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(
          "https://backend-uhub.onrender.com/api/admin/alltraningproduct",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setTrainingProducts(response.data);
      } catch (err) {
        setError("Failed to fetch training products");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        "https://backend-uhub.onrender.com/api/admin/deletetraningproduct",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Product deleted successfully!");
        setTrainingProducts(
          trainingProducts.filter((product) => product._id !== productId)
        );
      }
    } catch (err) {
      setError("Failed to delete the product");
    }
  };

  if (loading)
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        All Training Products
      </h2>
      {successMessage && (
        <div className="text-green-600 text-center mb-4">{successMessage}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingProducts.map((product) => (
          <div key={product._id} className="bg-white shadow-md rounded-lg p-6">
            <img
              src={`https://backend-uhub.onrender.com${product.image}`}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-gray-700 font-medium mb-2">
              Price: ${product.price}
            </p>

            <button
              onClick={() => handleDelete(product._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 w-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alltraningproducts;

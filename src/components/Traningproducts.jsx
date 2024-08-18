import React, { useState, useEffect } from "react";
import axios from "axios";

const Traningproducts = () => {
  const [trainingProducts, setTrainingProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remainingProducts, setRemainingProducts] = useState(0);
  const apiUrl = "https://backend-uhub.onrender.com";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Function to fetch remaining training products count
  const fetchRemainingProducts = async () => {
    try {
      const remainingResponse = await axios.get(
        `${apiUrl}/remaningtraningproduct?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (
        remainingResponse.data &&
        typeof remainingResponse.data.remainingtraningProducts === "number"
      ) {
        setRemainingProducts(remainingResponse.data.remainingtraningProducts);
      } else {
        setError("Unexpected response structure for remaining products count");
      }
    } catch (err) {
      setError("Error fetching remaining products count");
      console.error(err);
    }
  };

  // Function to fetch training products
  const fetchTrainingProducts = async () => {
    try {
      const productsResponse = await axios.get(
        `${apiUrl}/traningproducts?userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(productsResponse.data);
      // Assuming the API returns a list of products
      setTrainingProducts(productsResponse.data);
    } catch (err) {
      setError("Error fetching training products");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRemainingProducts();
    fetchTrainingProducts();
  }, [token]);

  const handleSubmitTask = async () => {
    const currentProduct = trainingProducts[currentProductIndex];

    if (!currentProduct) return;

    try {
      // Submit the task
      await axios.post(
        `${apiUrl}/submit-task`,
        {
          productId: currentProduct._id,
          userId,
          productType: "training",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update remaining products count on the backend
      await axios.post(
        `${apiUrl}/updatetraningremaningproduct`,
        {
          userId,
          remainingProducts: Math.max(remainingProducts - 1, 0),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the success message
      setSuccess("Task submitted successfully");

      // Filter out the submitted product from the list
      setTrainingProducts((prevProducts) =>
        prevProducts.filter((_, index) => index !== currentProductIndex)
      );

      // Move to the next product
      setCurrentProductIndex((prev) => {
        const nextIndex = prev < trainingProducts.length - 1 ? prev : prev - 1;
        return nextIndex >= 0 ? nextIndex : null;
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      let errorMessage = "An error occurred";
      if (err.response) {
        errorMessage = err.response.data.message || "An error occurred";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setTimeout(() => setError(""), 3000);
      console.error(err);
    }
  };

  return (
    <div className="w-full h-[800px] mx-auto mt-20 px-4 flex flex-col items-center">
      {currentProductIndex === null ? (
        <>
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Logo"
            className="w-[160px] h-[140px] mt-2 ml-2"
          />
          <p className="text-4xl text-blue-600 font-bold mt-4">
            Training Products
          </p>
          <button
            onClick={() => setCurrentProductIndex(0)}
            className="w-[60%] h-20 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4 text-3xl font-bold"
          >
            Start Now ({remainingProducts}/20)
          </button>
        </>
      ) : (
        <>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
              {success}
            </div>
          )}
          {trainingProducts.length > 0 &&
          currentProductIndex < trainingProducts.length ? (
            <div className="border p-3 rounded shadow-md max-w-md mx-auto mt-6">
              <h3 className="text-lg font-semibold">
                {trainingProducts[currentProductIndex].name}
              </h3>
              <p className="text-sm mt-1">
                {trainingProducts[currentProductIndex].description}
              </p>
              {trainingProducts[currentProductIndex].image && (
                <img
                  src={`${apiUrl}/${trainingProducts[currentProductIndex].image}`}
                  alt={trainingProducts[currentProductIndex].name}
                  className="w-full h-auto mt-3 rounded"
                />
              )}
              <button
                onClick={handleSubmitTask}
                className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-2xl font-bold"
              >
                Submit
              </button>
            </div>
          ) : (
            <p className="text-center text-red-600 text-2xl mt-6 font-bold">
              No more products to show
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Traningproducts;

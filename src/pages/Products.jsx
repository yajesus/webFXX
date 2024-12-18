import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Traningproducts from "../components/Traningproducts"; // Import the training component

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalProducts] = useState(40); // Fixed totalProducts value
  const [remainingProducts, setRemainingProducts] = useState(0);
  const [isProductPendingApproval, setIsProductPendingApproval] =
    useState(false);
  const [canSubmitProducts, setCanSubmitProducts] = useState(false);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { t } = useTranslation();
  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://backend-uhub.onrender.com/api/user/get-approval-status?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { canSubmitProducts, isTrainingComplete, isApproved } =
          response.data;
        setCanSubmitProducts(canSubmitProducts);
        setIsTrainingComplete(isTrainingComplete);
        setIsApproved(isApproved);
      } catch (err) {
        setError("Error fetching approval status");
        console.error(err);
      }
    };

    fetchApprovalStatus();
  }, [userId]);

  // Fetch products if the user is approved and training is complete
  useEffect(() => {
    if (canSubmitProducts && isTrainingComplete && isApproved) {
      const fetchProducts = async () => {
        try {
          const token = localStorage.getItem("token");

          // Fetch user's products
          const response = await axios.get(
            `https://backend-uhub.onrender.com/api/user/usersproducts?userId=${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(response.data);
          const allProducts = response.data;

          // Fetch remaining products for the specific user
          const responseRemaining = await axios.get(
            `https://backend-uhub.onrender.com/api/user/remaningproduct?userId=${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const remainingCount = responseRemaining.data.remainingProducts;

          setRemainingProducts(remainingCount);
          setProducts(allProducts);
        } catch (err) {
          setError("Error fetching products");
          console.error(err);
        }
      };

      fetchProducts();
    }
  }, [userId, canSubmitProducts, isTrainingComplete, isApproved]);

  const handleStartNow = () => {
    setCurrentProductIndex(0); // Start showing products
  };

  const handleBoost = async () => {
    const token = localStorage.getItem("token");
    const currentProduct = products[currentProductIndex];

    if (remainingProducts <= 0) {
      setError("No remaining products to submit.");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        `https://backend-uhub.onrender.com/api/user/submit-task`,
        {
          productId: currentProduct._id,
          userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { message, remainingProducts } = response.data;
      setSuccess(message || "Balance updated successfully");

      // Update remainingProducts based on the API response
      setRemainingProducts(remainingProducts);
      localStorage.setItem("remainingProducts", remainingProducts);

      // Save the updated remaining count for the user
      await axios.post(
        `https://backend-uhub.onrender.com/api/user/updateremainingproduct`,
        {
          userId,
          remainingProducts: Math.max(remainingProducts - 1, 0),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Move to the next product only if it’s not pending approval
      setCurrentProductIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex < products.length ? nextIndex : null;
      });

      setTimeout(() => setSuccess(""), 3000);

      // Update the user's total amount
      const profit = currentProduct.profit;
      await axios.post(
        `https://backend-uhub.onrender.com/api/user/updateamount`,
        {
          userId,
          profit,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      let errorMessage = "An error occurred";
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

  // Conditionally render either the Products or Training Products component
  if (!canSubmitProducts || !isTrainingComplete || !isApproved) {
    return <Traningproducts />;
  }

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
            {t("boost_mission")}
          </p>
          <button
            onClick={handleStartNow}
            className="w-[60%] h-20 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4 text-3xl font-bold"
          >
            {t("start_now")} ({remainingProducts}/{totalProducts})
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
              <button
                onClick={handleBoost}
                className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-2xl font-bold"
                disabled={isProductPendingApproval}
              >
                Boost
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

export default Products;

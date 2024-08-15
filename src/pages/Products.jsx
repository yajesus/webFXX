import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(null); // Start as null to show logo initially
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [remainingProducts, setRemainingProducts] = useState(0);
  const [isProductPendingApproval, setIsProductPendingApproval] =
    useState(false);
  const { t } = useTranslation();
  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch all available products
        const response = await axios.get(
          `https://backend-uhub.onrender.com/api/user/usersproducts?userId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const allProducts = response.data;
        setTotalProducts(allProducts.length); // Set total products

        // Load remaining products from localStorage or set to total initially
        const storedRemainingProducts =
          localStorage.getItem("remainingProducts");
        const initialCount = storedRemainingProducts
          ? parseInt(storedRemainingProducts)
          : allProducts.length;
        setRemainingProducts(initialCount);

        // Set products to display
        setProducts(allProducts);
      } catch (err) {
        setError("Error fetching products");
        console.error(err);
      }
    };

    fetchProducts();
  }, [userId]);

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
      // Check if the current product is premium
      const isPremium = currentProduct.isPremium;
      const approved = currentProduct.isApproved;

      if (isPremium && !approved) {
        // Product is premium and not approved yet, stay on this product
        setIsProductPendingApproval(true);
        setSuccess("Product submission is pending admin approval.");
        setError("");
        return;
      } else {
        setIsProductPendingApproval(false);
      }

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

      const { message } = response.data;

      setSuccess(message || "Balance updated successfully");

      // Update remainingProducts and move to the next product only if it’s not pending approval
      setRemainingProducts((prev) => {
        const newRemaining = Math.max(prev - 1, 0);
        localStorage.setItem("remainingProducts", newRemaining);
        return newRemaining;
      });

      // Move to the next product only if it’s not pending approval
      setCurrentProductIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex < products.length ? nextIndex : null; // Set to null if no more products
      });

      setTimeout(() => setSuccess(""), 3000);

      // Calculate the profit to be added
      const profit = currentProduct.profit;

      // Update the user's total amount
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

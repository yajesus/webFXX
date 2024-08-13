import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(null); // Start as null to show logo initially
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const submittedProductIds =
          JSON.parse(localStorage.getItem("submittedProductIds")) || [];

        const response = await axios.get(`${apiUrl}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter out already submitted products
        const filteredProducts = response.data.filter(
          (product) => !submittedProductIds.includes(product._id)
        );
        setProducts(filteredProducts);
      } catch (err) {
        setError("Error fetching products");
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleStartNow = () => {
    setCurrentProductIndex(0); // Start showing products
  };

  const handleBoost = async () => {
    const token = localStorage.getItem("token");
    const currentProduct = products[currentProductIndex];
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post(
        `${apiUrl}/api/user/submit-task`,
        {
          userId: userId,
          productId: currentProduct._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (
        response.data.message ===
        "Product submission is pending admin approval."
      ) {
        setSuccess("Product is pending admin approval");
      } else {
        setSuccess("Balance updated successfully");
      }
      setError("");
      setTimeout(() => setSuccess(""), 3000);

      // Update local storage to remember the submitted product
      const submittedProductIds =
        JSON.parse(localStorage.getItem("submittedProductIds")) || [];
      submittedProductIds.push(currentProduct._id);
      localStorage.setItem(
        "submittedProductIds",
        JSON.stringify(submittedProductIds)
      );

      // Move to the next product
      setCurrentProductIndex((prevIndex) => prevIndex + 1);
      setProgress((prevProgress) => prevProgress + 1);
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
            {t("start_now")} ({progress}/{products.length})
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
              <p className="text-sm">
                Premium:{" "}
                {products[currentProductIndex].isPremium ? "Yes" : "No"}
              </p>
              <button
                onClick={handleBoost}
                className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-2xl font-bold"
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

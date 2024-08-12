import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const BindWallet = () => {
  const [walletName, setWalletName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPassword, setWalletPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form fields
    if (!walletName || !walletAddress || !walletPassword) {
      setError("Please fill in all the fields.");
      setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
      return;
    }

    try {
      // Retrieve the JWT token from localStorage or sessionStorage
      const token = localStorage.getItem("token"); // or sessionStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log(token);
      // Make the POST request to bind the wallet with JWT in headers
      const response = await axios.post(
        "http://localhost:5000/api/user/bind-wallet",
        {
          userId,
          walletName,
          walletAddress,
          walletPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success
      setSuccess("Wallet bound successfully!");
      setTimeout(() => {
        setSuccess("");
        navigate("/"); // Redirect to the dashboard after success
      }, 3000);
    } catch (err) {
      console.error("Binding wallet error:", err.response);
      const errorMessage = err.response?.data?.message || "An error occurred.";
      setError(errorMessage);
      setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
    }
  };

  return (
    <main>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="w-full flex justify-center mt-14">
          <p className="text-4xl font-bold">{t("bind_your_wallet")}</p>
        </div>
        <form
          className="w-[60%] flex flex-col gap-5 mt-7"
          onSubmit={handleSubmit}
        >
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
          <div className="w-full gap-1 flex flex-col">
            <label className="font-semibold">{t("walletName")}</label>
            <input
              type="text"
              className="w-full divsize h-14 p-4 rounded-md"
              placeholder="Wallet Name"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
            />
          </div>
          <div className="w-full gap-1 flex flex-col">
            <label className="font-semibold">{t("walletAddress")}</label>
            <input
              type="text"
              className="w-full divsize h-14 p-4 rounded-md"
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          <div className="w-full gap-1 flex flex-col">
            <label className="font-semibold">{t("walletPassword")}</label>
            <input
              type="password"
              className="w-full divsize h-14 p-4 rounded-md"
              placeholder="Wallet Password"
              value={walletPassword}
              onChange={(e) => setWalletPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full h-14 bg-red-700 rounded-2xl text-white font-semibold text-xl"
            type="submit"
          >
            {t("confirm")}
          </button>
        </form>
      </div>
    </main>
  );
};

export default BindWallet;

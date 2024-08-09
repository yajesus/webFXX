import React, { useState } from "react";
import axios from "axios";

const Withdrawal = () => {
  const [amount, setAmount] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/request-withdrawal",
        {
          userId: userId,
          amount: amount,
          withdrawalPassword: withdrawalPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Withdrawal request submitted successfully");
      setError("");
      setAmount("");
      setWithdrawalPassword("");
      setTimeout(() => setSuccess(""), 3000);
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
    }
  };

  return (
    <main>
      <div className="w-full flex flex-col items-center gap-8">
        <div className="w-full flex justify-center">
          <p className="font-bold text-3xl mt-14">Withdrawal</p>
        </div>
        <div className="w-[60%] flex flex-col gap-8">
          <button className="w-full h-14 bg-blue-600 rounded-2xl text-white font-semibold text-2xl">
            Crypto
          </button>

          <form className="flex flex-col gap-5" onSubmit={handleWithdrawal}>
            <div className="w-full gap-1 flex flex-col">
              <label className="font-semibold">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full divsize h-14 p-4 rounded-md"
                placeholder="Amount to Withdraw"
              />
            </div>
            <div className="w-full gap-1 flex flex-col">
              <label className="font-semibold">Withdrawal Password</label>
              <input
                type="password"
                value={withdrawalPassword}
                onChange={(e) => setWithdrawalPassword(e.target.value)}
                className="w-full divsize h-14 p-4 rounded-md"
                placeholder="Withdrawal password"
              />
            </div>
            <button
              className="w-full h-14 bg-red-700 rounded-2xl text-white font-semibold text-xl"
              type="submit"
            >
              Confirm
            </button>
          </form>
          {error && (
            <div className="bg-red-100 text-red-700 p-2 mt-4 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-2 mt-4 rounded">
              {success}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Withdrawal;

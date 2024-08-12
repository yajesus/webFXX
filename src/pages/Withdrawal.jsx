import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Withdrawal = () => {
  const [amount, setAmount] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [withdrawalPending, setWithdrawalPending] = useState(false);
  const [withdrawalId, setWithdrawalId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWithdrawalStatus = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        // Fetch the latest withdrawal status
        const response = await axios.get(
          `http://localhost:5000/api/user/withdrawal/status/${response.data.withdrawalId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.withdrawalPending) {
          setWithdrawalPending(true);
          setWithdrawalId(response.data.withdrawalId);
        }
      } catch (err) {
        console.error("Failed to fetch withdrawal status:", err);
      }
    };

    checkWithdrawalStatus();
  }, []);

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

      setSuccess(
        "Withdrawal request submitted successfully. Please wait for approval."
      );
      setError("");
      setAmount("");
      setWithdrawalPassword("");
      setWithdrawalPending(true);
      setWithdrawalId(response.data.withdrawalId); // Assuming the response contains withdrawalId

      // Check withdrawal status every 5 seconds
      const intervalId = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `http://localhost:5000/api/user/withdrawal/status/${response.data.withdrawalId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (statusResponse.data.status === "approved") {
            setSuccess("Your withdrawal has been approved.");
            setWithdrawalPending(false);
            clearInterval(intervalId); // Stop checking if approved

            // Redirect to home page after 3 seconds
            setTimeout(() => {
              navigate("/"); // Redirect to home page
            }, 3000);
          }
        } catch (err) {
          console.error("Failed to check withdrawal status:", err);
        }
      }, 5000);

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
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

      // Clear error after 3 seconds
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
            Fund
          </button>

          {!withdrawalPending && (
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
          )}

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
          {withdrawalPending && (
            <p className="bg-yellow-100 text-yellow-700 p-2 mt-4 rounded">
              Withdrawal pending approval.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Withdrawal;

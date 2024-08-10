import React, { useState, useEffect } from "react";
import axios from "axios";

const Approvewidthdrwal = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/users-with-transactions", // Replace with your endpoint
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  const handleApprove = async (transactionId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/admin/approve-withdrawal`,
        {
          transactionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Transaction approved successfully!");
      setTransactions((prev) =>
        prev.filter((transaction) => transaction._id !== transactionId)
      );
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError("Failed to approve the transaction.");
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Approve Withdrawal Requests
        </h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                {successMessage}
              </div>
            )}
            {transactions.length > 0 ? (
              <ul className="space-y-4">
                {transactions.map((transaction) => (
                  <li
                    key={transaction._id}
                    className="p-4 bg-gray-100 rounded-md shadow-md flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-semibold">
                        User: {transaction.user?.username || "N/A"}
                      </p>
                      <p className="text-gray-600">
                        Amount: ${transaction.amount}
                      </p>
                      <p className="text-gray-600">
                        Status: {transaction.status}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApprove(transaction._id)}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                    >
                      Approve
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No pending transactions.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Approvewidthdrwal;

import React, { useEffect, useState } from "react";
import axios from "axios";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/user/transaction-history/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTransactions(response.data);
      } catch (err) {
        setError("Error fetching transaction history");
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-gray-100 p-4 mt-10">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Transaction History
        </h1>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-lg font-semibold text-gray-700">
            No transactions found
          </p>
        ) : (
          <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Type</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b last:border-none"
                  >
                    <td className="py-2 px-4">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">{transaction.type}</td>
                    <td className="py-2 px-4">${transaction.amount}</td>
                    <td
                      className={`py-2 px-4 font-semibold ${
                        transaction.status === "Completed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default Transaction;

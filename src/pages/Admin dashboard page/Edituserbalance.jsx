import React, { useState, useEffect } from "react";
import axios from "axios";

const Edituserbalance = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch users when component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users");
        setTimeout(() => setError(""), 3000);
      }
    };

    fetchUsers();
  }, [token]);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem("adminToken");
    try {
      await axios.put(
        "http://localhost:5000/api/admin/edit-user-balance",
        {
          userId: selectedUser,
          amount: parseFloat(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      // Post the transaction to the transaction history
      await axios.post(
        "http://localhost:5000/api/admin/posttransaction",
        {
          userId: selectedUser,
          amount: parseFloat(amount),
          type: "deposit", // Always deposit
          status: "approved", // or any status you need
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setSuccess("User balance updated successfully");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error updating user balance:", error);
      setError(
        error.response?.data?.message || "Failed to update user balance"
      );
      setSuccess("");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit User Balance</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user" className="block mb-2 font-semibold">
            Select User:
          </label>
          <select
            id="user"
            value={selectedUser}
            onChange={handleUserChange}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username || user.email || user.phoneNumber}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block mb-2 font-semibold">
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            required
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Balance
        </button>
      </form>
    </div>
  );
};

export default Edituserbalance;

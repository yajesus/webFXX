import React, { useState, useEffect } from "react";
import axios from "axios";

const Resetuser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backend-uhub.onrender.com/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setUsers(response.data);
      } catch (err) {
        setError("Error fetching users.");
        console.error(err);
      }
    };

    fetchUsers();
  }, [token]);

  const handleReset = async (userId, action) => {
    try {
      const canSubmitPremiumProducts = action === "reset"; // Reset = true, Unreset = false

      const response = await axios.post(
        "https://backend-uhub.onrender.com/api/admin/resetpremiumproduct",
        { userId, canSubmitPremiumProducts }
      );

      setSuccess(response.data.message);
      setError("");

      // Update the user status in the UI
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, canSubmitPremiumProducts } : user
      );
      setUsers(updatedUsers);

      // Clear the success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      setError("Error updating user status.");
      setSuccess("");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reset User Premium Submission</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          {success}
        </div>
      )}
      {users.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Username</th>
              <th className="py-2">Phone Number</th>
              <th className="py-2">Wallet</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                <td className="py-2">{user.username}</td>
                <td className="py-2">{user.phoneNumber}</td>
                <td className="py-2">{user.wallet}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleReset(user._id, "Unreset")}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                  >
                    Unrest
                  </button>
                  <button
                    onClick={() => handleReset(user._id, "reset")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Resetuser;

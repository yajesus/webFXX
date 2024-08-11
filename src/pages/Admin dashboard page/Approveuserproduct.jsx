import React, { useState, useEffect } from "react";
import axios from "axios";

const Approveuserproduct = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/users-submitted-products",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleApprove = async (userId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/approve-user",
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("User approved successfully!");
      setError("");

      // Remove the approved user from the list
      setUsers(users.filter((user) => user._id !== userId));

      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError("Failed to approve user");
      setSuccess("");
      setTimeout(() => setError(""), 3000); // Clear error message after 3 seconds
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Approve Users</h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        ) : success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            {success}
          </div>
        ) : (
          <div className="space-y-4">
            {users.length > 0 ? (
              <ul>
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="p-4 bg-gray-50 rounded-md shadow-md flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-semibold">{user.username}</p>
                      <p className="text-gray-600">Email: {user.email}</p>
                      <p className="text-gray-500">
                        Submitted Products: {user.submittedProducts.length}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                      Approve
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No users to show</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Approveuserproduct;

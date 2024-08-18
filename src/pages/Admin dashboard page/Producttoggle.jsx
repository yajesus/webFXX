import React, { useState, useEffect } from "react";
import axios from "axios";

const Producttoggle = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        setUsers(response.data);

        // Load color state from local storage
        const savedStates =
          JSON.parse(localStorage.getItem("userColorStates")) || {};
        setUsers((prevUsers) =>
          prevUsers.map((user) => ({
            ...user,
            colorState: savedStates[user._id] || "gray", // Default to gray if not in local storage
          }))
        );
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleToggle = async (userId, currentColorState) => {
    const newColorState = currentColorState === "green" ? "red" : "green";
    const canSubmitProducts = newColorState === "green";
    const isTrainingComplete = canSubmitProducts; // Set based on your logic
    const isApproved = canSubmitProducts;
    try {
      await axios.post(
        "https://backend-uhub.onrender.com/api/admin/toggle-product-user",
        {
          userId,
          canSubmitProducts,
          colorState: newColorState,
          isTrainingComplete,
          isApproved,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local storage
      const updatedStates =
        JSON.parse(localStorage.getItem("userColorStates")) || {};
      updatedStates[userId] = newColorState;
      localStorage.setItem("userColorStates", JSON.stringify(updatedStates));

      // Update state
      setUsers(
        users.map((user) =>
          user._id === userId
            ? { ...user, canSubmitProducts, colorState: newColorState }
            : user
        )
      );
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Failed to update user");
    }
  };

  return (
    <main className="w-full h-full p-6 bg-gray-100">
      <div className="container mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="w-full flex justify-center">
              <p className="font-bold text-3xl text-blue-600">
                Manage Product Submission
              </p>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg mt-7">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b">
                    <td className="py-2 px-4">{user.username}</td>
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleToggle(user._id, user.colorState)
                          }
                          className={`px-4 py-2 rounded ${
                            user.colorState === "green"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          Allow Submission
                        </button>
                        <button
                          onClick={() =>
                            handleToggle(user._id, user.colorState)
                          }
                          className={`px-4 py-2 rounded ${
                            user.colorState === "red"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          Disallow Submission
                        </button>
                      </div>
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

export default Producttoggle;

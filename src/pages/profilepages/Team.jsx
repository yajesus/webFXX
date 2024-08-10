import React, { useState, useEffect } from "react";
import axios from "axios";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // Ensure token is properly set
  const userId = localStorage.getItem("userId"); // Ensure userId is properly set
  console.log(userId);
  useEffect(() => {
    if (!token || !userId) return; // Skip fetching if token or userId is missing

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/users-invited-by",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set Authorization header
            },
            params: {
              userId, // Pass userId as a query parameter
            },
          }
        );
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, userId]);

  return (
    <main className="flex flex-col items-center p-6 space-y-6">
      {loading && (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
          <div className="animate-spin border-4 border-t-4  border-gray-200 rounded-full w-12 h-12"></div>
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-4 mt-36">
          <p className="text-lg text-red-500">Error: {error}</p>
        </div>
      )}
      {!loading && !error && (
        <div className="w-full max-w-4xl flex flex-col items-center mt-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">
            Team Members
          </h1>
          <ul className="flex flex-wrap gap-4">
            {users.map((user) => (
              <li
                key={user._id}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center w-48"
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default Team;

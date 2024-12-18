import React, { useState, useEffect } from "react";
import axios from "axios";

const Usersdetail = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track which user's dropdown is open
  const [invitedUsers, setInvitedUsers] = useState({}); // Store invited users by userId
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
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const fetchInvitedUsers = async (userId) => {
    try {
      const response = await axios.get(
        "https://backend-uhub.onrender.com/api/user/users-invited-by",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId,
          },
        }
      );
      setInvitedUsers((prev) => ({
        ...prev,
        [userId]: response.data,
      }));
    } catch (err) {
      console.error("Failed to fetch invited users", err);
    }
  };

  const toggleDropdown = (userId) => {
    if (dropdownOpen === userId) {
      setDropdownOpen(null); // Close dropdown if already open
    } else {
      setDropdownOpen(userId); // Open dropdown for the selected user
      if (!invitedUsers[userId]) {
        fetchInvitedUsers(userId); // Fetch invited users if not already fetched
      }
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
              <p className="font-bold text-3xl text-blue-600">Users Detail</p>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg mt-7">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">Phone Number</th>
                  <th className="py-3 px-4 text-left">Balance</th>
                  <th className="py-3 px-4 text-left">Wallet Name</th>
                  <th className="py-3 px-4 text-left">Wallet Address</th>
                  <th className="py-3 px-4 text-left">Invited Users</th>
                  <th className="py-3 px-4 text-left">Submitted Products</th>
                  <th className="py-3 px-4 text-left">
                    Submitted Training Products
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b">{user.username}</td>
                    <td className="py-2 px-4 border-b">{user.phoneNumber}</td>
                    <td className="py-2 px-4 border-b">{user.balance}</td>
                    <td className="py-2 px-4 border-b">
                      {user.wallet?.walletName || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {user.wallet?.walletAddress || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(user._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          {dropdownOpen === user._id ? "Hide" : "Show"} Invited
                          Users
                        </button>
                        {dropdownOpen === user._id && (
                          <div className="absolute bg-white border rounded shadow-lg mt-2 p-2 w-48 z-10">
                            {invitedUsers[user._id] ? (
                              invitedUsers[user._id].length > 0 ? (
                                invitedUsers[user._id].map(
                                  (invitedUser, index) => (
                                    <div key={invitedUser._id}>
                                      <p className="text-gray-800">
                                        {invitedUser.username}
                                      </p>
                                      {index <
                                        invitedUsers[user._id].length - 1 && (
                                        <hr className="my-2" />
                                      )}
                                    </div>
                                  )
                                )
                              ) : (
                                <p className="text-gray-600">
                                  No invited users
                                </p>
                              )
                            ) : (
                              <p className="text-gray-600">Loading...</p>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {user.submittedProducts.length}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {user.submittedTrainingProducts == null
                        ? 0
                        : user.submittedTrainingProducts.length}
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

export default Usersdetail;

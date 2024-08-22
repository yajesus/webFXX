import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Utility function to check password strength
const isStrongPassword = (password) => {
  // Example password strength requirements:
  // At least 8 characters long
  // Contains at least one uppercase letter
  // Contains at least one lowercase letter
  // Contains at least one digit
  // Contains at least one special character
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
};

const Newpassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  console.log(userId);
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError("Password does not meet strength requirements");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend-uhub.onrender.com/api/user/newpassword",
        {
          userId,
          newPassword,
        }
      );

      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
    }
  };

  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-[80%] md:w-[70%] lg:w-[30%] h-[300px] divsize rounded-md mt-20">
        <div className="w-full flex justify-center">
          <p className="text-4xl text-blue-600 font-bold mt-6">
            Reset Password
          </p>
        </div>
        <form
          className="w-full flex flex-col items-center mt-6 gap-3"
          onSubmit={handleResetPassword}
        >
          <div className="w-full flex flex-col">
            <label className="md:ml-6 ml-8 lg:ml-8">New Password</label>
            <input
              type="password"
              className="w-[80%] h-10 divsize md:ml-6 ml-8 lg:ml-8 rounded-md p-4 focus:outline-blue-600"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {success && <div className="text-green-500 mt-2">{success}</div>}
          <div className="w-full flex justify-center">
            <button
              className="w-[80%] h-10 bg-blue-600 rounded-md text-white"
              type="submit"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Newpassword;

import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ChangePass = () => {
  const [show, setShow] = useState(true); // True for login password, false for withdrawal password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword) {
      setError("Enter old password");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!newPassword) {
      setError("Enter new password");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!confirmPassword) {
      setError("Enter confirm password");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      // Set the correct endpoint based on whether it's login or withdrawal password
      const endpoint = show
        ? "https://backend-uhub.onrender.com/api/user/update-password" // Login password endpoint
        : "https://backend-uhub.onrender.com/api/user/update-withdrawal-password"; // Withdrawal password endpoint

      // Set the correct payload based on the type of password being changed
      const payload = show
        ? { oldPassword, newPassword, userId } // For login password
        : {
            userId,
            oldWithdrawalPassword: oldPassword, // Naming based on the withdrawal controller
            newWithdrawalPassword: newPassword,
          };

      const response = await axios.put(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setSuccess(response.data.message);
      setError(""); // Clear any existing error message
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <main>
      <div className="w-full h-full absolute mt-20">
        <div className="w-full flex justify-between">
          <button
            className={`ml-6 btn w-[170px] h-[50px] rounded-md ${
              show ? "bg-blue-500 text-white" : "bg-transparent text-black"
            }`}
            onClick={() => setShow(true)}
          >
            Login Password
          </button>
          <button
            className={`mr-6 btn w-[170px] h-[50px] rounded-md ${
              !show ? "bg-blue-500 text-white" : "bg-transparent text-black"
            }`}
            onClick={() => setShow(false)}
          >
            Withdrawal Password
          </button>
        </div>
        <div className="w-full flex justify-center items-center">
          <form
            className="w-[60%] flex flex-col gap-5 mt-7"
            onSubmit={handleSubmit}
          >
            <div className="w-full gap-1 flex flex-col relative">
              <label className="font-semibold">
                {show ? "Old Password" : "Old Withdrawal Password"}
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                className="w-full divsize h-14 p-4 rounded-md"
                placeholder={show ? "Old Password" : "Old Withdrawal Password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showOldPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowOldPassword(!showOldPassword)}
              />
            </div>
            <div className="w-full gap-1 flex flex-col relative">
              <label className="font-semibold">
                {show ? "New Password" : "New Withdrawal Password"}
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full divsize h-14 p-4 rounded-md"
                placeholder={show ? "New Password" : "New Withdrawal Password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showNewPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            </div>
            <div className="w-full gap-1 flex flex-col relative">
              <label className="font-semibold">
                {show ? "Confirm Password" : "Confirm Withdrawal Password"}
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full divsize h-14 p-4 rounded-md"
                placeholder={
                  show ? "Confirm Password" : "Confirm Withdrawal Password"
                }
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            <button
              className="w-full h-14 bg-red-700 rounded-2xl text-white font-semibold text-xl"
              type="submit"
            >
              Confirm
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-500 mt-2">{success}</div>}
          </form>
        </div>
      </div>
    </main>
  );
};

export default ChangePass;

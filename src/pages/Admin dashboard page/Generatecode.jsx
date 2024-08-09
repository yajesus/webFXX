import React, { useState } from "react";
import axios from "axios";

const GenerateInviteCode = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleGenerate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/generate-invite-code",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setInviteCode(response.data.inviteCode);
      setSuccess("Invite code generated successfully");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setSuccess("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        onClick={handleGenerate}
      >
        Generate Invite Code
      </button>
      {inviteCode && (
        <div className="mt-4 p-4 bg-gray-100 rounded shadow">
          <p className="text-lg font-semibold">Invite Code: {inviteCode}</p>
        </div>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}
    </div>
  );
};

export default GenerateInviteCode;

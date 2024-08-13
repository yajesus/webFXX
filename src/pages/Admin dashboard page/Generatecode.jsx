import React, { useState, useEffect } from "react";
import axios from "axios";

const GenerateInviteCode = () => {
  const [inviteCodes, setInviteCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    const fetchInviteCodes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://backend-uhub.onrender.com/api/admin/invite-codes",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        setInviteCodes(response.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch invite codes");
      } finally {
        setLoading(false);
      }
    };

    fetchInviteCodes();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend-uhub.onrender.com/api/admin/generate-invite-code",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      setInviteCodes([...inviteCodes, response.data]);
      setSuccess("Invite code generated successfully");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 2000); // Reset copied status after 2 seconds
    });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Invite Code"}
      </button>
      {loading && <p className="mt-2 text-gray-600">Loading...</p>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}

      <div className="mt-4 w-full max-w-lg">
        {inviteCodes.map((inviteCode) => (
          <div
            key={inviteCode._id}
            className="p-4 bg-gray-100 rounded shadow mb-2 flex justify-between items-center"
          >
            <p className="text-lg font-semibold">{inviteCode.code}</p>
            <button
              className={`bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-300 ${
                copiedCode === inviteCode.code ? "bg-green-500" : ""
              }`}
              onClick={() => handleCopy(inviteCode.code)}
            >
              {copiedCode === inviteCode.code ? "Copied!" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateInviteCode;

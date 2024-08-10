import React, { useState, useEffect } from "react";
import axios from "axios";

const Invitation = () => {
  const [referralCode, setReferralCode] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy Referral Code");
  const [generateStatus, setGenerateStatus] = useState("");

  const token = localStorage.getItem("token"); // Ensure token is properly set
  const userId = localStorage.getItem("userId"); // Ensure userId is properly set
  console.log("userid", userId);

  useEffect(() => {
    if (!token || !userId) return; // Skip fetching if token or userId is missing

    const fetchReferralCode = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/invite-code",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set Authorization header
            },
            params: {
              userId, // Pass userId as a query parameter
            },
          }
        );
        setReferralCode(response.data.code);
      } catch (error) {
        console.error("Error fetching referral code:", error);
      }
    };

    fetchReferralCode();
  }, [token, userId]);

  const handleGenerateCode = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/user/generate-invite-code",
        { userId }, // Send userId in request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set Authorization header
          },
        }
      );
      setGenerateStatus("Invite code generated!");
      // Refresh the referral code after generation
      const response = await axios.get(
        "http://localhost:5000/api/user/invite-code",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set Authorization header
          },
          params: {
            userId, // Pass userId as a query parameter
          },
        }
      );
      setReferralCode(response.data.code);
    } catch (error) {
      console.error("Error generating invite code:", error);
      setGenerateStatus("Failed to generate code");
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralCode)
      .then(() => setCopyStatus("Copied!"))
      .catch(() => setCopyStatus("Failed to copy"));
    // Reset copy status after 2 seconds
    setTimeout(() => setCopyStatus("Copy Referral Code"), 2000);
  };

  return (
    <main>
      <div className="w-full flex justify-center items-center flex-col mt-8">
        <div className="w-[60%] h-52 shadow-xl flex justify-center items-center mt-10 divsize rounded-xl">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Logo"
            className="w-[200px] h-[190px]"
          />
        </div>
        <div className="flex justify-center items-center flex-col gap-5 mt-6">
          <p className="font-bold text-xl">My Referral Code</p>
          <p className="font-bold rounded-xl text-red-700 text-center">
            {referralCode || "No referral code available"}
          </p>
          <button
            className="w-[300px] h-14 bg-red-700 rounded-xl text-white"
            onClick={handleCopy}
            disabled={!referralCode}
          >
            {copyStatus}
          </button>
          <button
            className="w-[300px] h-14 bg-blue-700 rounded-xl text-white mt-4"
            onClick={handleGenerateCode}
          >
            Generate Invite Code
          </button>
          {generateStatus && (
            <p className="mt-2 text-green-500">{generateStatus}</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Invitation;

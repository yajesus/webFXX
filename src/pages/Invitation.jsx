import React, { useState, useEffect } from "react";
import axios from "axios";

const Invitation = () => {
  const [referralCode, setReferralCode] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy Referral Code");

  const token = localStorage.getItem("token"); // Ensure token is properly set
  const userId = localStorage.getItem("userId"); // Ensure userId is properly set

  useEffect(() => {
    console.log(userId);
    const fetchReferralCode = async () => {
      try {
        const response = await axios.get(
          `https://backend-uhub.onrender.com/api/user/invite-code`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              userId: userId, // Send userId as a query parameter
            },
          }
        );
        console.log(response.data);
        setReferralCode(response.data.inviteCode);
      } catch (error) {
        console.error(
          "Error fetching referral code:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchReferralCode();
  }, []);

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
        </div>
      </div>
    </main>
  );
};

export default Invitation;

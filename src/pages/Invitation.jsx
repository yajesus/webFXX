import React, { useState, useEffect } from "react";
import axios from "axios";

const Invitation = () => {
  const [referralCode, setReferralCode] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy Referral Code");

  useEffect(() => {
    // Fetch the referral code from the backend
    const fetchReferralCode = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/invite-codes",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userId")}`,
            },
          }
        );
        console.log(response.data.code);
        setReferralCode(response.data.code);
      } catch (error) {
        console.error("Error fetching referral code:", error);
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
          <p className="font-bold rounded-xl text-red-700">{referralCode}</p>
          <button
            className="w-[300px] h-14 bg-red-700 rounded-xl text-white"
            onClick={handleCopy}
          >
            {copyStatus}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Invitation;

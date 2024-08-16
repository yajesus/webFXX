import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillTransfer,
  faWallet,
  faUserPlus,
  faLock,
  faBell,
  faShareNodes,
  faUser,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [todaysCommission, setTodaysCommission] = useState(0);
  const [username, setUsername] = useState("");
  const [referralCode, setReferralCode] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    // Clear user token and userId from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect to the login page
    navigate("/login");
  };

  useEffect(() => {
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

    // Fetch total amount and today's commission
    const fetchUsername = async () => {
      try {
        const response = await axios.get(
          `https://backend-uhub.onrender.com/api/user/username`,
          {
            params: { userId }, // Pass userId as query parameter
            headers: {
              Authorization: `Bearer ${token}`, // Include token if required by your API
            },
          }
        );
        setUsername(response.data.username); // Set the username state
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    const fetchFinances = async () => {
      try {
        const response = await axios.get(
          `https://backend-uhub.onrender.com/api/user/finances?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token if required by your API
            },
          }
        );
        console.log(response.data);
        setTotalAmount(response.data.totalAmount);
        setTodaysCommission(response.data.todayscommision);
      } catch (error) {
        console.error("Error fetching finances:", error);
      }
    };

    // Call the function
    fetchReferralCode();
    fetchFinances();
    fetchUsername();
  }, [userId, token]);

  return (
    <main>
      <div
        className="w-full lg:h-[800px] h-[100%] relative mt-16 flex flex-col items-center gap-6 z-10"
        style={{ zIndex: 10, zIndexImportant: true }}
      >
        <div className="w-full flex justify-center mt-8">
          <h1 className="text-5xl font-bold ">Profile</h1>
        </div>
        <div className="w-[80%] h-52 rounded-lg bg-blue-950 flex flex-col items-center">
          <div className="w-full flex gap-5 mt-5 ml-11 items-center">
            <FontAwesomeIcon icon={faUser} className="text-3xl white" />
            <p className="text-white text-3xl font-bold">{username}</p>
          </div>
          <div className="w-[95%] flex flex-col mt-5 gap-3">
            <div className="w-full h-[1px] z-50 bg-white"></div>
            <p className="text-white font-thin">
              Referral Code: {referralCode}
            </p>
          </div>
          <div className="w-full flex justify-between">
            <div className="flex flex-col items-center bottom-0 mt-8">
              <p className="ml-5 text-white font-thin">Total Amount</p>
              <p className="ml-5 text-white font-thin">{totalAmount} USDT</p>
            </div>
            <div className="flex flex-col items-center bottom-0 mt-8 mr-5">
              <p className="ml-5 text-white font-thin">Today's Commission</p>
              <p className="mr-5 text-white font-thin">
                {todaysCommission} USDT
              </p>
            </div>
          </div>
        </div>
        <div className="w-[70%] h-[1000px] absolute mt-48">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-48 gap-y-16 justify-center mt-32">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon
                  icon={faMoneyBillTransfer}
                  className="text-4xl purple"
                />
              </div>
              <Link
                to="/Customerservice"
                className="hover:text-blue-500 hover:underline font-bold"
              >
                {t("deposit")}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon icon={faWallet} className="text-4xl purple" />
              </div>
              <Link
                to="/withdrawal"
                className="hover:text-blue-500 hover:underline font-bold"
              >
                {t("withdrawal")}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="text-4xl purple"
                />
              </div>
              <Link
                to="/Team"
                className="hover:text-blue-500 hover:underline font-bold"
              >
                {t("myTeam")}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon icon={faWallet} className="text-4xl purple" />
              </div>
              <Link
                to="/Wallet"
                className="hover:text-blue-500 hover:underline font-bold"
              >
                {t("bindWallet")}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon icon={faLock} className="text-4xl purple" />
              </div>
              <Link
                to="/Changepass"
                className="hover:text-blue-500 hover:underline font-bold"
              >
                {t("changePassword")}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon
                  icon={faDatabase}
                  className="text-4xl purple"
                />
              </div>
              <Link
                to="/Transaction"
                className="hover:text-blue-500 hover:underline font-bold"
              >
                {t("transaction")}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon icon={faUser} className="text-4xl purple" />
              </div>
              <Link
                to="/Customerservice"
                className="hover:text-blue-500 hover:underline font-bold"
              >
                {t("customerService")}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon icon={faBell} className="text-4xl purple" />
              </div>
              <Link
                to="/Notification"
                className="hover:text-blue-500 hover:underline font-bold"
              >
                {t("notifications")}
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon
                  icon={faShareNodes}
                  className="text-4xl purple"
                />
              </div>
              <Link
                to="/invitation"
                className="hover:text-blue-500 hover:underline font-bold"
              >
                {t("invitation")}
              </Link>
            </div>
          </div>
          <div className="w-full flex justify-center ">
            <button
              className="w-[60%] h-20 bg-red-600 absolute rounded-md text-white mt-5"
              onClick={handleLogout}
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;

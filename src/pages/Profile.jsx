import React from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLogout = () => {
    // Clear user token and userId from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect to the login page
    navigate("/login");
  };
  return (
    <main>
      <div
        className="w-full lg:h-[800px]  h-[100%] relative  mt-16 flex flex-col items-center gap-6 z-10"
        style={{ zIndex: 10, zIndexImportant: true }}
      >
        <div className="w-[80%] h-14 rounded-lg bg-blue-950 flex justify-between items-center  ">
          <p className="ml-5 text-white font-thin">10 USDT</p>
          <p className="mr-5 text-white font-thin">7 USDT</p>
        </div>
        <div className="w-[70%] h-[full] absolute ">
          <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-48 gap-y-16 justify-center mt-32">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[100px] h-[70px] rounded-md divsize flex flex-col justify-center items-center">
                <FontAwesomeIcon
                  icon={faMoneyBillTransfer}
                  className="text-4xl purple"
                />
              </div>
              <Link
                to="/Customerservice"
                class=" hover:text-blue-500 hover:underline font-bold "
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
                class=" hover:text-blue-500 hover:underline font-bold "
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
                class=" hover:text-blue-500 hover:underline font-bold "
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
                class=" hover:text-blue-500 hover:underline font-bold "
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
                class=" hover:text-blue-500 hover:underline font-bold "
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
                class=" hover:text-blue-500 hover:underline font-bold "
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
                class=" hover:text-blue-500 hover:underline font-bold "
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
                class=" hover:text-blue-500 hover:underline font-bold "
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
                class=" hover:text-blue-500 hover:underline font-bold "
              >
                {t("invitation")}
              </Link>
            </div>
          </div>
          <div className="w-full flex justify-center ">
            <button
              className="w-[60%] h-20 bg-red-600  absolute rounded-md text-white mt-5"
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

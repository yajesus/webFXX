import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCalendarDays,
  faWallet,
  faSquareShareNodes,
  faCrown,
  faCircleQuestion,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import Recharge from "./Recharge";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Events = () => {
  const [showrecharge, setShowrecharge] = useState(false);
  const { t } = useTranslation();
  function show() {
    setShowrecharge(!showrecharge);
  }
  return (
    <>
      <div className="w-full  flex items-center justify-center ">
        <div class=" grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-28 gap-y-10 ">
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-5xl purple"
            />
            <Link
              to="/event"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              {t("event")}
            </Link>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon
              icon={faMoneyBillWave}
              className="text-5xl purple"
            />
            <p
              class=" hover:text-blue-500 hover:underline cursor-pointer font-bold"
              onClick={show}
            >
              {t("recharge")}
            </p>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faWallet} className="text-5xl purple" />
            <Link
              to="/withdrawal"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              {t("withdrawal")}
            </Link>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon
              icon={faSquareShareNodes}
              className="text-5xl purple"
            />
            <Link
              to="/invitation"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              {t("invitation")}
            </Link>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faBuilding} className="text-5xl purple" />
            <Link
              to="/company"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              {t("company")}
            </Link>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faCrown} className="text-5xl purple" />
            <Link
              to="/Tc"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              {t("tc")}
            </Link>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon
              icon={faCircleQuestion}
              className="text-5xl purple"
            />
            <Link
              to="/FAQ"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              {t("faqs")}
            </Link>
          </div>
        </div>
        {showrecharge ? <Recharge /> : ""}
      </div>
    </>
  );
};

export default Events;

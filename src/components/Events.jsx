import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCalendarDays,
  faWallet,
  faSquareShareNodes,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const Events = () => {
  return (
    <>
      <div className="w-100 flex">
        <div class=" ml-[200px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-28 gap-y-10 ">
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-5xl purple"
            />
            <Link
              to="/event"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              Event
            </Link>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon
              icon={faMoneyBillWave}
              className="text-5xl purple"
            />
            <p class=" hover:text-blue-500 hover:underline cursor-pointer font-bold">
              Recharge
            </p>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faWallet} className="text-5xl purple" />
            <Link
              to="/withdrawal"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              Withdrawl
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
              Invitation
            </Link>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-5xl purple"
            />
            <Link
              to="/company"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              Company
            </Link>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon icon={faCrown} className="text-5xl purple" />
            <Link
              to="/Tc"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              T&C
            </Link>
          </div>
          <div className="w-[150px] h-[100px] rounded-md divsize flex flex-col justify-center items-center">
            <FontAwesomeIcon
              icon={faSquareShareNodes}
              className="text-5xl purple"
            />
            <Link
              to="/Tc"
              class=" hover:text-blue-500 hover:underline font-bold "
            >
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Events;

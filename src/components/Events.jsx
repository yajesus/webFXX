import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCalendarDays,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const Events = () => {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div className="w-[150px] h-[100px] rounded-md divsize flex justify-center items-center">
        <FontAwesomeIcon icon={faCalendarDays} className="text-5xl purple" />
        <Link to="/event">Event</Link>
      </div>

      <FontAwesomeIcon icon={faMoneyBillWave} className="text-5xl purple" />
      <FontAwesomeIcon icon={faWallet} className="text-5xl purple" />
      <FontAwesomeIcon icon={faCalendarDays} className="text-3xl" />
      <FontAwesomeIcon icon={faCalendarDays} className="text-3xl" />
    </div>
  );
};

export default Events;

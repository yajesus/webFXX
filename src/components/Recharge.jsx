import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const Recharge = () => {
  function close() {
    const now = document.querySelector(".all");
    now.style.display = "none";
  }
  return (
    <div className="w-full h-full fixed top-0 z-10 background_recharge flex justify-center items-center all">
      <div className="w-[550px] h-[160px] bg-white flex flex-col gap-5 rounded-md">
        <div className="flex justify-between mt-2">
          <p className="ml-[20px] font-bold ">Recharge</p>
          <FontAwesomeIcon
            icon={faXmark}
            className="mr-[20px] cursor-pointer"
            onClick={close}
          />
        </div>
        <div className="w-full flex justify-center">
          <p>Please Contact Customer Service to Recharge</p>
        </div>
        <div className="w-full flex justify-center">
          <button className="w-[100px] h-[50px] bg-blue-600 text-white font-semibold rounded-md cursor-pointer ">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recharge;

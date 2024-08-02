import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
const Header = () => {
  return (
    <>
      <header>
        <div className="w-full h-11 shadow-md absolute z-40 top-0">
          <div className="w-full h-full flex justify-between items-center z-40 relative">
            <p className="ml-5">Web fx</p>
            <div className="relative inline-block">
              <FontAwesomeIcon icon={faBell} className=" mr-5" />
              <span className="absolute mr-5 top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                0
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

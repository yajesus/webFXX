import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faBackwardFast,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <>
      <footer>
        <div className="w-full h-10 md:h-14 lg:h-20 bg-slate-900 bottom-0  fixed flex justify-between items-center z-40">
          <Link to="/" class="  font-bold text-white">
            <div className="w-[150px] h-[100px]  flex flex-col justify-center items-center">
              <FontAwesomeIcon
                icon={faHouseChimney}
                className="text-1xl md:text-4xl lg:text-5xl navcolor"
              />
              <p>Home</p>
            </div>
          </Link>
          <Link to="/products" class="  font-bold text-white">
            <div className="w-[150px] h-[100px]  flex flex-col justify-center items-center">
              <FontAwesomeIcon
                icon={faBackwardFast}
                className="text-1xl md:text-4xl lg:text-5xl navcolor"
              />
              <p>Starting</p>
            </div>
          </Link>
          <Link to="/Profile" class="  font-bold text-white">
            <div className="w-[150px] h-[100px]  flex flex-col justify-center items-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-1xl md:text-4xl lg:text-5xl navcolor"
              />
              <p>Profile</p>
            </div>
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;

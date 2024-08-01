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
        <div className="w-full h-24 bg-slate-900 bottom-0  fixed flex justify-around items-center ">
          <Link to="/event" class="  font-bold text-white">
            <div className="w-[150px] h-[100px]  flex flex-col justify-center items-center">
              <FontAwesomeIcon
                icon={faHouseChimney}
                className="text-5xl navcolor"
              />
              <p>Home</p>
            </div>
          </Link>
          <Link to="/event" class="  font-bold text-white">
            <div className="w-[150px] h-[100px]  flex flex-col justify-center items-center">
              <FontAwesomeIcon
                icon={faBackwardFast}
                className="text-5xl navcolor"
              />
              <p>Starting</p>
            </div>
          </Link>
          <Link to="/event" class="  font-bold text-white">
            <div className="w-[150px] h-[100px]  flex flex-col justify-center items-center">
              <FontAwesomeIcon icon={faUser} className="text-5xl navcolor" />
              <p>Profile</p>
            </div>
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;

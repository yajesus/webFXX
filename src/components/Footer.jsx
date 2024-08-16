import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faBackwardFast,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <footer>
        <div className="w-full h-10 md:h-14 lg:h-20 bg-slate-900 bottom-0  fixed flex justify-around items-center z-40">
          <div className="w-full h-10 md:h-14 lg:h-20 bg-slate-900 bottom-0  fixed flex justify-around items-center z-40 mr-20 md:mr-0">
            <Link to="/" class="  font-bold text-white">
              <div className="w-[150px] h-[100px]  flex flex-col justify-center items-center">
                <FontAwesomeIcon
                  icon={faHouseChimney}
                  className="text-1xl md:text-4xl lg:text-5xl navcolor"
                />
                <p>{t("home")}</p>
              </div>
            </Link>
            <Link to="/products" class="  font-bold text-white">
              <div className="w-[150px] h-[100px]  flex flex-col justify-center items-center">
                <FontAwesomeIcon
                  icon={faBackwardFast}
                  className="text-1xl md:text-4xl lg:text-5xl navcolor"
                />
                <p>{t("starting")}</p>
              </div>
            </Link>
            <Link to="/Profile" class="  font-bold text-white">
              <div className="w-[150px] h-[100px]  flex flex-col justify-center items-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-1xl md:text-4xl lg:text-5xl navcolor"
                />
                <p>{t("profile")}</p>
              </div>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

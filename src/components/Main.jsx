import React from "react";
import Events from "./Events";
import { useTranslation } from "react-i18next";
const Main = () => {
  const { t } = useTranslation();
  return (
    <>
      <main>
        <div className="w-full h-full  absolute  mt-20">
          <div className="w-full  flex justify-center mt-9">
            <h1 className="font-bold text-4xl ">{t("welcome")}</h1>
          </div>
          <div className="mt-8">
            <Events />
          </div>
        </div>
      </main>
    </>
  );
};

export default Main;

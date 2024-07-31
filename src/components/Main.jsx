import React from "react";
import Events from "./Events";
const Main = () => {
  return (
    <>
      <main>
        <div className="w-full flex justify-center mt-9">
          <h1 className="font-bold text-4xl ">Welcome</h1>
        </div>
        <div>
          <Events />
        </div>
      </main>
    </>
  );
};

export default Main;

import React from "react";

const Invitation = () => {
  return (
    <main>
      <div className="w-full flex justify-center items-center flex-col mt-8">
        <div className="w-[60%] h-52 shadow-xl flex justify-center items-center mt-10 divsize rounded-xl">
          <p className="">Web FX</p>
        </div>
        <div className=" flex justify-center items-center flex-col gap-5 mt-6">
          <p className="font-bold text-xl">My Referral Code</p>
          <p className="font-bold rounded-xl text-red-700">2Z856F</p>
          <button className="w-[300px] h-14 bg-red-700 rounded-xl text-white">
            Copy Referral Code
          </button>
        </div>
      </div>
    </main>
  );
};

export default Invitation;

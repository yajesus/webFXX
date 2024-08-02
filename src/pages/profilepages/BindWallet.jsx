import React from "react";

const BindWallet = () => {
  return (
    <main>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="w-full flex justify-center">
          <p className="text-4xl font-bold">Bind your Wallet</p>
        </div>
        <form className="w-[60%] flex flex-col gap-5 mt-7">
          <div className="w-full gap-1 flex flex-col">
            <label className="font-semibold">Wallet Name</label>
            <input
              type="text"
              className="w-full divsize h-14 p-4 rounded-md"
              placeholder="Wallet Name"
            />
          </div>
          <div className="w-full gap-1 flex flex-col">
            <label className="font-semibold">Wallet Address</label>
            <input
              type="text"
              className="w-full divsize h-14 p-4 rounded-md"
              placeholder="Wallet Address"
            />
          </div>
          <div className="w-full gap-1 flex flex-col">
            <label className="font-semibold">Wallet Password</label>
            <input
              type="text"
              className="w-full divsize h-14 p-4 rounded-md"
              placeholder="Wallet Password"
            />
          </div>
          <button
            className="w-full h-14 bg-red-700 rounded-2xl text-white font-semibold text-xl"
            type="submit"
          >
            Confirm
          </button>
        </form>
      </div>
    </main>
  );
};

export default BindWallet;

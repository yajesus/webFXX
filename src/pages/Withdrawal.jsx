import React from "react";

const Withdrawal = () => {
  return (
    <main>
      <div className="w-full flex flex-col items-center gap-8">
        <div className="w-full flex justify-center">
          <p className="font-bold text-3xl mt-14">Withdrawl</p>
        </div>
        <div className="w-[60%] flex flex-col gap-8">
          <button className="w-full h-14 bg-blue-600 rounded-2xl text-white font-semibold text-2xl">
            Crypro
          </button>

          <form className=" flex flex-col gap-5">
            <div className="w-full gap-1 flex flex-col">
              <label className="font-semibold">Amount</label>
              <input
                type="text"
                className="w-full divsize h-14 p-4 rounded-md"
                placeholder="Amount to Withdraw"
              />
            </div>
            <div className="w-full gap-1 flex flex-col">
              <label className="font-semibold">Withdrawl password</label>
              <input
                type="text"
                className="w-full divsize h-14 p-4 rounded-md"
                placeholder="Withdrawl password"
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
      </div>
    </main>
  );
};

export default Withdrawal;

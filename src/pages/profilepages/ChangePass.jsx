import React, { useState } from "react";

const ChangePass = () => {
  const [show, setShow] = useState(false);
  function showall() {
    const btn1 = document.querySelector(".btn1");
    const btn2 = document.querySelector(".btn2");
    btn1.style.backgroundColor = "blue";
    btn2.style.backgroundColor = "transparent";
    btn1.style.color = "white";
    btn2.style.color = "black";
    setShow(true);
  }
  function showwithdarw() {
    const btn1 = document.querySelector(".btn1");
    const btn2 = document.querySelector(".btn2");
    btn2.style.backgroundColor = "blue";
    btn2.style.color = "white";
    btn1.style.color = "black";
    btn1.style.backgroundColor = "transparent";
    setShow(false);
  }
  return (
    <main>
      <div className="w-full h-full  absolute mt-20">
        <div className="w-full flex justify-between">
          <button
            className="ml-6 btn w-[170px] h-[50px] rounded-md  btn1"
            onClick={showall}
          >
            Login Password
          </button>
          <button
            className="mr-6 btn w-[170px] h-[50px] rounded-md  btn2"
            onClick={showwithdarw}
          >
            Withdrawl Password
          </button>
        </div>
        <div className="w-full flex  justify-center items-center">
          {show ? (
            <form className="w-[60%] flex flex-col gap-5 mt-7 loginfrom">
              <div className="w-full gap-1 flex flex-col">
                <label className="font-semibold">Old Password</label>
                <input
                  type="password"
                  className="w-full divsize h-14 p-4 rounded-md"
                  placeholder="Old Password"
                />
              </div>
              <div className="w-full gap-1 flex flex-col">
                <label className="font-semibold">New Password</label>
                <input
                  type="password"
                  className="w-full divsize h-14 p-4 rounded-md"
                  placeholder="New Password"
                />
              </div>
              <div className="w-full gap-1 flex flex-col">
                <label className="font-semibold">Confirm Password</label>
                <input
                  type="password"
                  className="w-full divsize h-14 p-4 rounded-md"
                  placeholder="Confirm Password"
                />
              </div>
              <button
                className="w-full h-14 bg-red-700 rounded-2xl text-white font-semibold text-xl"
                type="submit"
              >
                Confirm
              </button>
            </form>
          ) : (
            <form className="w-[60%] flex flex-col gap-5 mt-7 withdrawfrom ">
              <div className="w-full gap-1 flex flex-col">
                <label className="font-semibold">Old Password</label>
                <input
                  type="password"
                  className="w-full divsize h-14 p-4 rounded-md"
                  placeholder="Old Withdrawl Password"
                />
              </div>
              <div className="w-full gap-1 flex flex-col">
                <label className="font-semibold">New Password</label>
                <input
                  type="password"
                  className="w-full divsize h-14 p-4 rounded-md"
                  placeholder="New Withdrawl Password"
                />
              </div>
              <div className="w-full gap-1 flex flex-col">
                <label className="font-semibold">Confirm Password</label>
                <input
                  type="password"
                  className="w-full divsize h-14 p-4 rounded-md"
                  placeholder="Confirm Withdrawl Password"
                />
              </div>
              <button
                className="w-full h-14 bg-red-700 rounded-2xl text-white font-semibold text-xl"
                type="submit"
              >
                Confirm
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default ChangePass;

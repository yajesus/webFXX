import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const Register = () => {
  const [username, setUserName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [widthdrwalpass, setWidthdrwalpass] = useState("");
  const [eyeshow, setEyeshow] = useState(false);
  const [eyeshow1, setEyeshow1] = useState(false);
  const [eyeshow2, setEyeshow2] = useState(false);
  function showeye() {
    const passwordInput = document.querySelector(".showpassword");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      setEyeshow(false);
    } else {
      setEyeshow(true);
      passwordInput.type = "password";
    }
  }
  function showeye1() {
    const passwordInput = document.querySelector(".showpassword1");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      setEyeshow1(false);
    } else {
      setEyeshow1(true);
      passwordInput.type = "password";
    }
  }
  function showeye2() {
    const passwordInput = document.querySelector(".showpassword2");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      setEyeshow2(false);
    } else {
      setEyeshow2(true);
      passwordInput.type = "password";
    }
  }
  return (
    <main>
      <div className="w-full h-full flex flex-col justify-center items-center absolute">
        <div className="w-full flex justify-center ">
          <p>Web fx</p>
        </div>
        <div className="w-[80%]  md:w-[40%] lg:w-[30%] h-[100%] divsize rounded-md ">
          <div className="w-full flex justify-center">
            <p className="text-4xl text-blue-600 font-bold mt-6">Register</p>
          </div>
          <form className="w-full flex flex-col items-center mt-6 gap-3">
            <div className="w-full flex flex-col">
              <label className="md:ml-6 ml-8 lg:ml-8">Username</label>
              <input
                type="text"
                className="w-[80%] h-10 divsize md:ml-6 ml-8 lg:ml-8 rounded-md p-4 focus:outline-blue-600"
                placeholder="Username/Phone No"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="ml-8">Phone Number</label>
              <div className="w-[full] flex flex-col justify-center items-center">
                <input
                  type="password"
                  className="w-[80%] h-10 divsize -ml-4 rounded-md p-4 focus:outline-blue-600 showpassword"
                  placeholder="Phone Number"
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
                <div className="w-[80%] flex justify-end  -mt-6">
                  {eyeshow ? (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="mr-5 cursor-pointer"
                      onClick={showeye}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faEye}
                      className="mr-5 cursor-pointer"
                      onClick={showeye}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label className="ml-8">Password</label>
              <div className="w-[full] flex flex-col justify-center items-center">
                <input
                  type="password"
                  className="w-[80%] h-10 divsize -ml-4 rounded-md p-4 focus:outline-blue-600 showpassword1"
                  placeholder="Password"
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
                <div className="w-[80%] flex justify-end  -mt-6">
                  {eyeshow1 ? (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="mr-5 cursor-pointer"
                      onClick={showeye1}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faEye}
                      className="mr-5 cursor-pointer"
                      onClick={showeye1}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label className="ml-8">Withdrwal Password</label>
              <div className="w-[full] flex flex-col justify-center items-center">
                <input
                  type="password"
                  className="w-[80%] h-10 divsize -ml-4 rounded-md p-4 focus:outline-blue-600 showpassword2"
                  placeholder="Withdrwal Password"
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
                <div className="w-[80%] flex justify-end  -mt-6">
                  {eyeshow2 ? (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="mr-5 cursor-pointer"
                      onClick={showeye2}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faEye}
                      className="mr-5 cursor-pointer"
                      onClick={showeye2}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col">
              <label className="ml-8">Invitation Code</label>
              <div className="w-[full] flex flex-col justify-center items-center">
                <input
                  type="password"
                  className="w-[80%] h-10 divsize -ml-4 rounded-md p-4 focus:outline-blue-600"
                  placeholder="Invitation Code"
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full flex gap-2 mt-6">
              <input type="checkbox" className="ml-8" />
              <p className=" cursor-pointer">Register Aggrement</p>
            </div>
            <div className="w-full flex justify-center">
              <button className="w-[80%] h-10 bg-blue-600 rounded-md text-white">
                Register
              </button>
            </div>
            <div className="w-full flex justify-center">
              <Link
                className="w-[80%] h-10 bg-blue-600 rounded-md text-white flex justify-center items-center"
                to="/login"
              >
                Back To Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;

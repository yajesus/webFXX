import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [eyeshow, setEyeshow] = useState(false);
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

  const handleLogin = () => {
    // Replace this with real authentication logic
    if (username === "user" && password === "password") {
      setIsLoggedIn(true);
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };
  return (
    <main>
      <div className="w-full h-full flex flex-col justify-center items-center ">
        <div className="w-full flex  justify-center ">
          <p>Web fx</p>
        </div>
        <div className="flex justify-center w-full gap-2 items-center mt-7">
          <FontAwesomeIcon icon={faPhoneVolume} className="text-xl" />
          <span className="font-semibold">Contact us</span>
        </div>
        <div className="w-[80%]  md:w-[70%] lg:w-[30%] h-[400px] divsize rounded-md mt-10">
          <div className="w-full flex justify-center">
            <p className="text-4xl text-blue-600 font-bold mt-6">Login</p>
          </div>
          <form className="w-full flex flex-col items-center mt-6 gap-3">
            <div className="w-full flex flex-col">
              <label className="md:ml-6 ml-8 lg:ml-8">Username/Phone No</label>
              <input
                type="text"
                className="w-[80%] h-10 divsize md:ml-6 ml-8 lg:ml-8 rounded-md p-4 focus:outline-blue-600"
                placeholder="Username/Phone No"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="ml-8">Password</label>
              <div className="w-[full] flex flex-col justify-center items-center">
                <input
                  type="password"
                  className="w-[80%] h-10 divsize -ml-4 rounded-md p-4 focus:outline-blue-600 showpassword"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
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
            <div className="w-full ">
              <p className="ml-8 text-blue-600 cursor-pointer">
                Forgot Password?
              </p>
            </div>
            <div className="w-full flex justify-center">
              <button
                className="w-[80%] h-10 bg-blue-600 rounded-md text-white"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            <div className="w-full flex justify-center gap-2 mt-6">
              <p>Not registered yet?</p>
              <Link className=" text-blue-600 cursor-pointer" to="/Register">
                Register Now
              </Link>
            </div>
          </form>
        </div>
        <div className="w-full flex mt-10">
          <p className="ml-[150px]">Register Aggrement</p>
        </div>
        <div className="w-full flex gap-5 items-center">
          <img
            src={`${process.env.PUBLIC_URL}/google.jpg`}
            alt="Logo"
            className="w-[200px] h-[150px] ml-[250px]"
          />
          <img
            src={`${process.env.PUBLIC_URL}/meta.jpg`}
            alt="Logo"
            className="w-[200px] h-[150px]"
          />
          <img
            src={`${process.env.PUBLIC_URL}/binance.jpg`}
            alt="Logo"
            className="w-[200px] h-[190px]"
          />
        </div>
      </div>
    </main>
  );
};

export default Login;

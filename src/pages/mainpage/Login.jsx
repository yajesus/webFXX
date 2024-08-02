import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      <div className="w-full h-full flex flex-col justify-center items-center absolute">
        <div className="w-full flex justify-center ">
          <p>Web fx</p>
        </div>
        <div className="w-[30%] h-[64%] divsize rounded-md ">
          <div className="w-full flex justify-center">
            <p className="text-4xl text-blue-600 font-bold mt-6">Login</p>
          </div>
          <form className="w-full flex flex-col items-center mt-6 gap-3">
            <div className="w-full flex flex-col">
              <label className="ml-8">Username/Phone No</label>
              <input
                type="text"
                className="w-[80%] h-10 divsize ml-8 rounded-md p-4"
                placeholder="Username/Phone No"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="ml-8">Password</label>
              <input
                type="password"
                className="w-[80%] h-10 divsize ml-8 rounded-md p-4"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full ">
              <p className="ml-8 text-blue-600 cursor-pointer">
                Forgot Password?
              </p>
            </div>
            <div className="w-full flex justify-center">
              <button
                className="w-[80%] h-10 bg-blue-600 rounded-md"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            <div className="w-full flex justify-center gap-2 mt-6">
              <p>Not registered yet?</p>
              <p className=" text-blue-600 cursor-pointer">Register Now</p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;

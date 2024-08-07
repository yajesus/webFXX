import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ setIsAdmin }) => {
  // Accept setIsAdmin prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState(""); // To track form validation errors
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Regular expression for validating email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check for empty fields
    if (!email || !password) {
      setFormError("Both fields are required");
      setTimeout(() => setFormError(""), 3000); // Clear error message after 3 seconds
      return;
    }

    // Validate email
    if (!emailRegex.test(email)) {
      setFormError("Invalid email address");
      setTimeout(() => setFormError(""), 3000); // Clear error message after 3 seconds
      return;
    }

    try {
      const response = await axios
        .post("http://localhost:5000/api/admin/login", {
          email,
          password,
        })
        .then((response) => {
          const token = response.data.token;
          localStorage.setItem("adminToken", token);
          console.log("your token", token);
          setIsAdmin(true);
          navigate("/admin/dashboard"); // Redirect to admin dashboard
        });
    } catch (err) {
      setError("Invalid credentials");
      setTimeout(() => setError(""), 3000); // Clear error message after 3 seconds
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center ">
      <div className="w-full h-12 flex justify-center ">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="w-[200px] h-[190px]"
        />
      </div>
      <div className="w-[80%] md:w-[70%] lg:w-[30%] h-[400px] divsize rounded-md mt-20">
        <div className="w-full flex justify-center">
          <p className="text-4xl text-blue-600 font-bold mt-6">Admin Login</p>
        </div>
        <form
          className="w-full flex flex-col items-center mt-6 gap-3"
          onSubmit={handleLogin}
        >
          <div className="w-full flex flex-col">
            <label className="md:ml-6 ml-8 lg:ml-8">Email</label>
            <input
              type="text"
              className="w-[80%] h-10 divsize md:ml-6 ml-8 lg:ml-8 rounded-md p-4 focus:outline-blue-600"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError(""); // Clear form error on change
              }}
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="md:ml-6 ml-8 lg:ml-8">Password</label>
            <input
              type="password"
              className="w-[80%] h-10 divsize md:ml-6 ml-8 lg:ml-8 rounded-md p-4 focus:outline-blue-600"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {formError && (
            <div className="w-full flex justify-center mt-2 text-red-600">
              <p>{formError}</p>
            </div>
          )}
        </form>
        <div className="w-full flex justify-center mt-9">
          <button
            className="w-[80%] h-10 bg-blue-600 rounded-md text-white"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        {error && (
          <div className="w-full flex justify-center mt-2 text-red-600">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;

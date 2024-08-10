import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import validator from "validator";
const Register = () => {
  const [username, setUserName] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [withdrawalPasswordVisible, setWithdrawalPasswordVisible] =
    useState(false);
  const [invitationCodeVisible, setInvitationCodeVisible] = useState(false);
  const navigate = useNavigate();
  const phonevalid = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  const handleVisibilityToggle = (type) => {
    if (type === "password") {
      setPasswordVisible(!passwordVisible);
    } else if (type === "withdrawal") {
      setWithdrawalPasswordVisible(!withdrawalPasswordVisible);
    } else if (type === "invitation") {
      setInvitationCodeVisible(!invitationCodeVisible);
    }
  };

  const validatePassword = (password) => {
    // Password should be at least 8 characters long and contain a mix of letters, numbers, and symbols
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (number) => {
    return phonevalid.test(number);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username) {
      setError("Enter user name");
    }

    if (!validatePhoneNumber(phonenumber)) {
      setError("Invalid phone number.");
      setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password is too weak. It should be at least 8 characters long and contain a mix of letters, numbers, and symbols."
      );
      setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
      return;
    }
    if (!validatePassword(withdrawalPassword)) {
      setError(
        "Withdrawal password is too weak. It should be at least 8 characters long and contain a mix of letters, numbers, and symbols."
      );
      setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
      return;
    }
    if (!invitationCode) {
      setError("Invitation code is required.");
      setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username: username,
          phoneNumber: phonenumber,
          password: password,
          withdrawalPassword: withdrawalPassword,
          invitationCode: invitationCode,
        }
      );
      // Handle success (e.g., redirect or show success message)
      setSuccess("Registered successfully");
      setTimeout(() => setSuccess(""), 5000);

      // Clear input fields
      setUserName("");
      setPhonenumber("");
      setPassword("");
      setWithdrawalPassword("");
      setInvitationCode("");

      // Redirect to login page
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Registration error:", err.response);
      const errorMessage = err.response?.data?.errors
        ? err.response.data.errors.map((e) => e.msg).join(", ")
        : err.response?.data?.message ||
          "An error occurred during registration.";
      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <main>
      <div className="w-full h-full flex flex-col items-center absolute">
        <div className="w-full flex justify-center flex-col items-center absolute">
          <div className="w-full h-12 flex justify-center">
            <img
              src={`${process.env.PUBLIC_URL}/logo.png`}
              alt="Logo"
              className="w-[200px] h-[190px]"
            />
          </div>
          <div className="flex justify-center w-full gap-2 items-center mt-20">
            <FontAwesomeIcon icon={faPhoneVolume} className="text-xl" />
            <Link
              to="/invitation"
              className="hover:text-blue-500 hover:underline font-bold"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="w-[80%] md:w-[40%] lg:w-[30%] h-[100%] divsize rounded-md mt-48 absolute">
          <div className="w-full flex justify-center">
            <p className="text-4xl text-blue-600 font-bold mt-6">Register</p>
          </div>
          <form
            className="w-full flex flex-col items-center mt-6 gap-3"
            onSubmit={handleRegister}
          >
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <div className="w-full flex flex-col">
              <label className="md:ml-6 ml-8 lg:ml-8">Username</label>
              <input
                type="text"
                className="w-[80%] h-10 divsize md:ml-6 ml-8 lg:ml-8 rounded-md p-4 focus:outline-blue-600"
                placeholder="Username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col">
              <label className="ml-8">Phone Number</label>
              <PhoneInput
                className="w-[80%] h-10 divsize ml-8 rounded-md p-4 focus:outline-blue-600"
                international
                countryCallingCodeEditable={false}
                placeholder="Phone Number"
                value={phonenumber}
                onChange={setPhonenumber}
                defaultCountry="US"
              />
            </div>

            <div className="w-full flex flex-col">
              <label className="ml-8">Password</label>
              <div className="w-full flex flex-col justify-center items-center">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="w-[80%] h-10 divsize -ml-4 rounded-md p-4 focus:outline-blue-600"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="w-[80%] flex justify-end -mt-6">
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="mr-5 cursor-pointer"
                    onClick={() => handleVisibilityToggle("password")}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col">
              <label className="ml-8">Withdrawal Password</label>
              <div className="w-full flex flex-col justify-center items-center">
                <input
                  type={withdrawalPasswordVisible ? "text" : "password"}
                  className="w-[80%] h-10 divsize -ml-4 rounded-md p-4 focus:outline-blue-600"
                  placeholder="Withdrawal Password"
                  value={withdrawalPassword}
                  onChange={(e) => setWithdrawalPassword(e.target.value)}
                />
                <div className="w-[80%] flex justify-end -mt-6">
                  <FontAwesomeIcon
                    icon={withdrawalPasswordVisible ? faEyeSlash : faEye}
                    className="mr-5 cursor-pointer"
                    onClick={() => handleVisibilityToggle("withdrawal")}
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col">
              <label className="ml-8">Invitation Code</label>
              <input
                type="text"
                className="w-[80%] h-10 divsize ml-8 rounded-md p-4 focus:outline-blue-600"
                placeholder="Invitation Code"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
              />
            </div>

            <div className="w-full flex gap-2 mt-6">
              <input type="checkbox" className="ml-8" required />
              <p className="cursor-pointer">Register Agreement</p>
            </div>

            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="w-[80%] h-10 bg-blue-600 rounded-md text-white"
              >
                Register
              </button>
            </div>

            <div className="w-full flex justify-center">
              <Link
                className="w-[80%] h-10 flex justify-center items-center text-blue-600 hover:underline"
                to="/login"
              >
                Have an Account? Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;

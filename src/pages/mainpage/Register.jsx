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
import { useTranslation } from "react-i18next";
import validator from "validator";
const Register = () => {
  const { t, i18n } = useTranslation();
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
  const [showOptions, setShowOptions] = useState(false);
  const [invitationCodeVisible, setInvitationCodeVisible] = useState(false);
  const navigate = useNavigate();
  const phonevalid = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  const apiUrl = process.env.REACT_APP_API_URL;
  const [acceptTerms, setAcceptTerms] = useState(false);
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
        `https://backend-uhub.onrender.com/api/auth/register`,
        {
          username: username,
          phoneNumber: phonenumber,
          password: password,
          withdrawalPassword: withdrawalPassword,
          invitationCode: invitationCode,
        }
      );
      // Handle success (e.g., redirect or show success message)
      t("registration_success");
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

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setShowOptions(false); // Close the dropdown after selection
  };

  return (
    <main>
      <div className="w-full h-full flex flex-col items-center absolute">
        <div className="w-full flex justify-end absolute z-50 mt-5 -ml-5">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faPhoneVolume} className="text-xl" />
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-black hover:text-blue-600 hover:underline focus:outline-none font-bold"
            >
              {t("language")}
            </button>
            {showOptions && (
              <ul className="absolute mt-10 bg-white border rounded shadow-lg">
                <li
                  onClick={() => handleLanguageChange("en")}
                  className="cursor-pointer p-2 hover:bg-blue-100"
                >
                  English
                </li>
                <li
                  onClick={() => handleLanguageChange("es")}
                  className="cursor-pointer p-2 hover:bg-blue-100"
                >
                  Español
                </li>
                <li
                  onClick={() => handleLanguageChange("de")}
                  className="cursor-pointer p-2 hover:bg-blue-100"
                >
                  Deutsch
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center flex-col items-center absolute mt-5">
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

        <div className="w-[80%] md:w-[40%] lg:w-[30%] h-[110%] divsize rounded-md mt-48">
          <div className="w-full flex justify-center">
            <h1 className="text-4xl text-blue-600 font-bold mt-6">
              {t("register")}
            </h1>
          </div>
          <form
            className="w-full flex flex-col items-center mt-6 gap-3"
            onSubmit={handleRegister}
          >
            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            {/* Username Field */}
            <div className="w-[80%] flex flex-col ">
              <label className="mb-1 text-left">{t("Username")}</label>
              <input
                type="text"
                className="w-full h-10 rounded-md p-4 border divsize focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder={t("Username")}
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {/* Phone Number Field */}
            <div className="w-[80%] flex flex-col ">
              <label className="mb-1 text-left">{t("phone_number")}</label>
              <PhoneInput
                className="w-full h-10 rounded-md p-4 border divsize focus:outline-none focus:ring-2 focus:ring-blue-600"
                international
                countryCallingCodeEditable={false}
                placeholder={t("Phone Number")}
                value={phonenumber}
                onChange={setPhonenumber}
                defaultCountry="US"
              />
            </div>

            {/* Password Field */}
            <div className="w-[80%] flex flex-col ">
              <label className="mb-1 text-left">{t("password")}</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="w-full h-10 rounded-md p-4 border divsize focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder={t("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    onClick={() => handleVisibilityToggle("password")}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Withdrawal Password Field */}
            <div className="w-[80%] flex flex-col">
              <label className="mb-1 text-left">
                {t("withdrawal_password")}
              </label>
              <div className="relative">
                <input
                  type={withdrawalPasswordVisible ? "text" : "password"}
                  className="w-full h-10 rounded-md p-4 border divsize focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder={t("withdrawal_password")}
                  value={withdrawalPassword}
                  onChange={(e) => setWithdrawalPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FontAwesomeIcon
                    icon={withdrawalPasswordVisible ? faEyeSlash : faEye}
                    onClick={() => handleVisibilityToggle("withdrawal")}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Invitation Code Field */}
            <div className="w-[80%] flex flex-col mb-4">
              <label className="mb-1 text-left">{t("invitation_code")}</label>
              <div className="relative">
                <input
                  type={invitationCodeVisible ? "text" : "password"}
                  className="w-full h-10 rounded-md p-4 border divsize focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder={t("invitation_code")}
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="w-[80%] flex flex-row items-center mt-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
              />
              <p>{t("register_agreement")}</p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-[80%] h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md mt-4 font-semibold"
            >
              {t("register")}
            </button>

            {/* Login Redirect */}
            <div className="w-full flex justify-center">
              <Link
                className="w-[80%] h-10 flex justify-center items-center text-blue-600 hover:underline"
                to="/login"
              >
                {t("Have an Account? Log In")}
              </Link>
            </div>
          </form>
        </div>
        {/* Footer Images */}
        <div className="mt-9 bottom-0 w-full flex flex-col lg:flex-row justify-center  md:flex-row gap-5 items-center">
          <img
            src={`${process.env.PUBLIC_URL}/google.jpg`}
            alt="Logo"
            className="md:w-[200px] md:h-[150px] lg:w-[200px] lg:h-[150px] lg:ml-[250px] w-[400px] h-[250px]"
          />
          <img
            src={`${process.env.PUBLIC_URL}/meta.jpg`}
            alt="Logo"
            className="w-[200px] h-[150px]"
          />
          <img
            src={`${process.env.PUBLIC_URL}/shopify.jpg`}
            alt="Logo"
            className="w-[200px] h-[190px]"
          />
        </div>
      </div>
    </main>
  );
};

export default Register;

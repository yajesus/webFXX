import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = ({ setIsLoggedIn }) => {
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [rememberMe, setRememberMe] = useState(false); // Remember Me state
  const [eyeshow, setEyeshow] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Check if a token is already stored
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      navigate("/"); // Redirect to home if token exists
    }
  }, [navigate, setIsLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username/phonenumber and password are required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `https://backend-uhub.onrender.com/api/auth/login`,
        {
          identifier: username,
          password: password,
          rememberMe: rememberMe, // Send rememberMe state to the backend
        }
      );

      const { userId, token } = response.data;

      if (userId && token) {
        // Store the token based on the "Remember Me" option
        if (rememberMe) {
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);
        } else {
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);
        }

        setIsLoggedIn(true);
        navigate("/");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err.response.data.message || "Login Failed");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const showeye = () => {
    const passwordInput = document.querySelector(".showpassword");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      setEyeshow(false);
    } else {
      setEyeshow(true);
      passwordInput.type = "password";
    }
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setShowOptions(false);
  };

  return (
    <main>
      <div className="w-full h-full flex flex-col items-center">
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
        <div className="w-full h-12 flex justify-center">
          <img
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="Logo"
            className="w-[200px] h-[190px]"
          />
        </div>
        <div className="flex justify-center w-full gap-2 items-center mt-20">
          <FontAwesomeIcon icon={faPhoneVolume} className="text-xl" />
          <Link className="hover:text-blue-500 hover:underline font-bold">
            Contact Us
          </Link>
        </div>
        <div className="w-[80%] md:w-[70%] lg:w-[30%] h-[480px] divsize rounded-md mt-10">
          <div className="w-full flex justify-center">
            <p className="text-4xl text-blue-600 font-bold mt-6">
              {t("login")}
            </p>
          </div>
          <form
            className="w-full flex flex-col items-center mt-6 gap-3"
            onSubmit={handleLogin}
          >
            <div className="w-full flex flex-col">
              <label className="md:ml-6 ml-8 lg:ml-8">
                {t("username_phone")}
              </label>
              <input
                type="text"
                className="w-[80%] h-10 divsize md:ml-6 ml-8 lg:ml-8 rounded-md p-4 focus:outline-blue-600"
                placeholder={t("username_phone")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col">
              <label className="ml-8">{t("password")}</label>
              <div className="w-[full] flex flex-col justify-center items-center">
                <input
                  type="password"
                  className="w-[80%] h-10 divsize lg:-ml-4 md:-ml-12 rounded-md p-4 focus:outline-blue-600 showpassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="w-[80%] flex justify-end -mt-6 md:-ml-8">
                  {eyeshow ? (
                    <FontAwesomeIcon
                      icon={faEyeSlash}
                      className="mr-5 cursor-pointer md:-ml-14"
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
            <div className="w-full flex items-center ml-10">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe">{t("remember_me")}</label>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <button
                  className="w-[80%] h-10 bg-blue-600 rounded-md text-white"
                  type="submit"
                >
                  {t("login")}
                </button>
              </div>
            )}
            <div className="w-full">
              <Link
                className="ml-8 text-blue-600 cursor-pointer"
                to="/Forgetpassword"
              >
                {t("forgot_password")}
              </Link>
            </div>
            <div className="w-full flex justify-center gap-2 mt-6">
              <p>{t("not_registered_yet")}</p>
              <Link className="text-blue-600 cursor-pointer" to="/Register">
                {t("register_now")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;

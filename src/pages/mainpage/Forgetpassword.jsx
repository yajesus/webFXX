import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Forgetpassword = ({ isForgetpassword, setIsForgetpassword }) => {
  const [username, setUsername] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleRegister = async (e) => {
    e.preventDefault();

    // Input validation
    if (!username || !invitationCode) {
      setError("Username and invitation code are required");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
      return;
    }

    try {
      // API call for password reset verification
      const response = await axios.post(
        "http://localhost:5000/api/user/forgot-password",
        {
          username,
          invitationCode,
        }
      );
      const { userId } = response.data;
      localStorage.setItem("userId", userId);

      setIsForgetpassword(true);
      setTimeout(() => navigate("/Newpassword"), 3000);
      setSuccess("User verified");
    } catch (err) {
      console.error("API Error:", err); // Log the error to the console
      setError(err.response?.data?.message || "Registration Failed");
      setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
    }
  };

  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full h-12 flex justify-center">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="w-[200px] h-[190px]"
        />
      </div>
      <div className="w-[80%] md:w-[70%] lg:w-[30%] h-[300px] divsize rounded-md mt-20">
        <div className="w-full flex justify-center">
          <p className="text-4xl text-blue-600 font-bold mt-6">
            {t("add_details")}
          </p>
        </div>
        <form
          className="w-full flex flex-col items-center mt-6 gap-3"
          onSubmit={handleRegister}
        >
          <div className="w-full flex flex-col">
            <label className="md:ml-6 ml-8 lg:ml-8">{t("username")}</label>
            <input
              type="text"
              className="w-[80%] h-10 divsize md:ml-6 ml-8 lg:ml-8 rounded-md p-4 focus:outline-blue-600"
              placeholder={t("username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col">
            <label className="md:ml-6 ml-8 lg:ml-8">
              {t("invitation_code")}
            </label>
            <input
              type="text"
              className="w-[80%] h-10 divsize md:ml-6 ml-8 lg:ml-8 rounded-md p-4 focus:outline-blue-600"
              placeholder={t("invitation_code")}
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {success && <div className="text-green-500 mt-2">{success}</div>}
          <div className="w-full flex justify-center">
            <button
              className="w-[80%] h-10 bg-blue-600 rounded-md text-white"
              type="submit"
            >
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Forgetpassword;

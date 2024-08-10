import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");
  const handleBellClick = async () => {
    if (!isOpen) {
      // Fetch notifications only when opening the dropdown
      const response = await fetch(
        "http://localhost:5000/api/user/Notification",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    }
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header>
        <div className="w-full h-12 shadow-md bg-white fixed z-40 top-0">
          <div className="w-full h-full flex justify-between items-center z-40 relative">
            <Link to="/">
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="Logo"
                className="w-[160px] h-[140px] mt-2 ml-2"
              />
            </Link>
            <div className="relative inline-block">
              <button onClick={handleBellClick} className="relative">
                <FontAwesomeIcon icon={faBell} className="mr-5 text-2xl" />
                {unreadCount > 0 && !isOpen && (
                  <span className="relative -top-3 left-[-20px] inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50"
                >
                  <div className="p-4">
                    <p className="font-bold text-lg mb-2">Notifications</p>
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">No notifications</p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-2 border-b border-gray-200"
                        >
                          <p className="font-semibold">{notification.title}</p>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

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
  const userId = localStorage.getItem("userId");
  // Fetch notifications and unread count on component mount
  console.log(token);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `https://backend-uhub.onrender.com/api/user/Notification`,
          {
            params: { userId }, // Pass userId as query parameter
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setNotifications(data);

        // Calculate unread notifications
        const unread = data.filter((n) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();
  }, [token]);

  const handleBellClick = async () => {
    if (!isOpen) {
      try {
        // Fetch notifications when opening the dropdown
        const response = await axios.get(
          `http://localhost:5000/api/user/Notification`,
          {
            params: { userId }, // Pass userId as query parameter
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        console.log(data);
        setNotifications(data);

        // Collect IDs of unread notifications
        const unreadNotifications = data.filter((n) => !n.read);
        const unreadIds = unreadNotifications.map((n) => n._id);

        // Mark notifications as read
        if (unreadIds.length > 0) {
          await axios.put(
            "http://localhost:5000/api/user/mark-as-read",
            { ids: unreadIds },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Update notifications to set read state
          setNotifications((prev) =>
            prev.map((n) =>
              unreadIds.includes(n._id) ? { ...n, read: true } : n
            )
          );
          setUnreadCount(0); // Set unread count to 0 after marking as read
        }
      } catch (err) {
        console.error("Failed to handle bell click", err);
      }
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
                  <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50 h-[500px] overflow-y-visible"
                >
                  <div className="p-4">
                    <p className="font-bold text-lg mb-2">Notifications</p>
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">No notifications</p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`relative p-2 border-b border-gray-200 ${
                            notification.read ? "bg-gray-100" : "bg-white"
                          }`}
                        >
                          <p className="font-semibold">
                            {notification.title}
                            {!notification.read && (
                              <span className="absolute top-1.5 right-2 transform -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full"></span>
                            )}
                          </p>
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

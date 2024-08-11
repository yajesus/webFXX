import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns"; // For formatting dates

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/Notification`,
          {
            params: { userId }, // Pass userId as query parameter
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token, userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        "http://localhost:5000/api/user/mark-as-read",
        {
          notificationId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(
        notifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-4 mb-4 rounded-lg shadow-md border-l-4 ${
              notification.read
                ? "border-gray-400 bg-gray-100"
                : "border-blue-500 bg-white"
            }`}
          >
            <p className="text-sm text-gray-600 mb-2">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
            <p className="text-md font-medium">{notification.message}</p>
            {!notification.read && (
              <button
                onClick={() => markAsRead(notification._id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Mark as read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;

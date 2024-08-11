import React, { useState, useEffect } from "react";
import axios from "axios";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleEventId, setVisibleEventId] = useState(null); // State to manage visible event
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setEvents(response.data);
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const handleToggleDetails = (eventId) => {
    setVisibleEventId((prevId) => (prevId === eventId ? null : eventId));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Events</h1>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6">
            No events to show
          </div>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event._id}
                className="p-4 bg-gray-50 rounded-md shadow-md flex flex-col md:flex-row md:justify-between md:items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {event.title}
                  </p>
                  {visibleEventId === event._id && (
                    <>
                      <p className="text-gray-600">{event.content}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleToggleDetails(event._id)}
                  className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                >
                  {visibleEventId === event._id
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Event;

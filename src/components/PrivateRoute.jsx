import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ element: Component, isAdminRoute, ...rest }) => {
  const token = localStorage.getItem("token");
  let isAuthenticated = false;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp > Date.now() / 1000) {
        isAuthenticated = true;
        isAdmin = decoded.role === "admin"; // Assuming token contains role information
      }
    } catch (e) {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/" />;
  }

  return Component;
};

export default PrivateRoute;

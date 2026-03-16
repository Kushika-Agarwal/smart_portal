import React from "react";
import { Navigate } from "react-router-dom";

function UserProtectedRoute({ children }) {

  const isVerified = localStorage.getItem("userVerified");

  if (!isVerified) {

    return <Navigate to="/" replace />;

  }

  return children;
}

export default UserProtectedRoute;
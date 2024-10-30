import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession } from 'utils/util_session';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = getSession('e_token'); // Assuming the token is stored in localStorage
  const rolecheck = getSession('role'); // Assuming the token is stored in localStorage
  if (!token) {
    // If there's no token, redirect to login
    return <Navigate to="/" state={{ from: location }} />;
  }

  try {
    if (rolecheck !== 'admin') {
      // If there's no checking admin, redirect to login
      return <Navigate to="/" state={{ from: location }} />;
    }
  } catch (error) {
    // If there's an error decoding the token, redirect to login
    return <Navigate to="/" state={{ from: location }} />;
  }

  // If the user is authenticated and an admin, render the children
  return children;
};

export default ProtectedRoute;

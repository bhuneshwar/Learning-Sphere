import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token'); // JWT token
  const user = JSON.parse(localStorage.getItem('user')); // User info from storage

  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" />; // Redirect unauthorized roles
  }

  return children; // Render children if authorized
};

export default ProtectedRoute;


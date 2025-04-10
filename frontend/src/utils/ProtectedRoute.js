import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const { token } = useSelector(state => state.auth);
  const user = useSelector(state => state.auth.user);

  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" />; // Redirect unauthorized roles
  }

  return children; // Render children if authorized
};

export default ProtectedRoute;


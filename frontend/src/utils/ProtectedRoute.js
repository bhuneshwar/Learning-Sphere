import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Or fetch from Redux state
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

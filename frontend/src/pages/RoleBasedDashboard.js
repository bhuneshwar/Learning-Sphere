import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LearnerDashboard from './LearnerDashboard';
import InstructorDashboard from './InstructorDashboard';

const RoleBasedDashboard = () => {
  // First try to get user from Redux state, then fallback to localStorage
  const authUser = useSelector((state) => state.auth?.user);
  const user = authUser || JSON.parse(localStorage.getItem('user'));

  // Redirect to appropriate dashboard based on role
  if (user?.role === 'Learner') {
    return <LearnerDashboard />;
  } else if (user?.role === 'Instructor') {
    return <InstructorDashboard />;
  } else if (user?.role === 'Admin') {
    // Redirect Admin users to the admin dashboard
    return <Navigate to="/admin" replace />;
  } else {
    return <div>Unauthorized: Invalid role</div>; // Handle invalid roles
  }
};

export default RoleBasedDashboard;

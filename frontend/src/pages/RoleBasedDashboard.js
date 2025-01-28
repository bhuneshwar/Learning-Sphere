import React from 'react';
import LearnerDashboard from './LearnerDashboard';
import InstructorDashboard from './InstructorDashboard';

const RoleBasedDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info from localStorage

  if (user?.role === 'Learner') {
    return <LearnerDashboard />;
  } else if (user?.role === 'Instructor') {
    return <InstructorDashboard />;
  } else {
    return <div>Unauthorized: Invalid role</div>; // Handle invalid roles
  }
};

export default RoleBasedDashboard;

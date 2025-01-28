import React from 'react';
import '../styles/dashboard.css';
import { signOut } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const LearnerDashboard = () => {
  const enrolledCourses = [
    { id: 1, title: 'React Basics', progress: 50 },
    { id: 2, title: 'Advanced JavaScript', progress: 30 },
  ];
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Welcome, Learner!</h1>
      <div className="course-list">
        {enrolledCourses.map((course) => (
          <div key={course.id} className="course-card">
            <h2>{course.title}</h2>
            <p>Progress: {course.progress}%</p>
          </div>
        ))}
      </div>
      <button className="logout-button" onClick={() => signOut(navigate)}>
        Logout
      </button>
    </div>
  );
};

export default LearnerDashboard;

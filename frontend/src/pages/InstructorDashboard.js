import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import { signOut } from '../utils/authUtils';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const createdCourses = [
    { id: 1, title: 'React Basics', learners: 20 },
    { id: 2, title: 'Node.js Mastery', learners: 15 },
  ];

  return (
    <div className="dashboard-container">
      <h1>Welcome, Instructor!</h1>
      <button className="create-course-btn" onClick={() => navigate('/create-course')}>
        Create New Course
      </button>
      <div className="course-list">
        {createdCourses.map((course) => (
          <div key={course.id} className="course-card">
            <h2>{course.title}</h2>
            <p>Learners Enrolled: {course.learners}</p>
          </div>
        ))}
      </div>
      <button className="logout-button" onClick={() => signOut(navigate)}>
        Logout
      </button>

    </div>
  );
};

export default InstructorDashboard;

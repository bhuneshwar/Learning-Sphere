import React from 'react';
import '../styles/dashboard.css';

const LearnerDashboard = () => {
  const enrolledCourses = [
    { id: 1, title: 'React Basics', progress: 50 },
    { id: 2, title: 'Advanced JavaScript', progress: 30 },
  ];

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
    </div>
  );
};

export default LearnerDashboard;

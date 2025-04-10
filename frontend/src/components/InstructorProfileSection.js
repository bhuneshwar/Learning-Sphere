import React from 'react';
import { useSelector } from 'react-redux';
import ProfileSection from './ProfileSection';
import '../styles/ProfileComponents.css';

const InstructorProfileSection = ({ isEditable = true }) => {
  const { user } = useSelector((state) => state.auth) || { user: JSON.parse(localStorage.getItem('user')) };
  
  // Mock data for instructor stats - in a real app, this would come from an API
  const instructorStats = {
    totalStudents: 135,
    totalCourses: 3,
    averageRating: 4.7,
    totalRevenue: 2980
  };

  return (
    <div className="instructor-profile-section">
      <ProfileSection isEditable={isEditable} />
      
      <div className="instructor-stats-section">
        <h3>Instructor Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon students-icon">👨‍🎓</div>
            <div className="stat-content">
              <h4>Total Students</h4>
              <p className="stat-value">{instructorStats.totalStudents}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon courses-icon">📚</div>
            <div className="stat-content">
              <h4>Active Courses</h4>
              <p className="stat-value">{instructorStats.totalCourses}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon rating-icon">⭐</div>
            <div className="stat-content">
              <h4>Average Rating</h4>
              <p className="stat-value">{instructorStats.averageRating}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon revenue-icon">💰</div>
            <div className="stat-content">
              <h4>Total Revenue</h4>
              <p className="stat-value">${instructorStats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="instructor-qualifications">
        <h3>Qualifications & Expertise</h3>
        <div className="qualifications-content">
          <p>Share your educational background, certifications, and areas of expertise to build credibility with potential students.</p>
          {/* This would be editable in a full implementation */}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfileSection;
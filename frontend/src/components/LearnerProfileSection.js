import React from 'react';
import { useSelector } from 'react-redux';
import ProfileSection from './ProfileSection';
import '../styles/ProfileComponents.css';

const LearnerProfileSection = ({ isEditable = true }) => {
  const { user } = useSelector((state) => state.auth) || { user: JSON.parse(localStorage.getItem('user')) };
  
  // Mock data for learner stats - in a real app, this would come from an API
  const learnerStats = {
    enrolledCourses: 4,
    completedCourses: 2,
    certificatesEarned: 2,
    totalHoursLearned: 48
  };

  // Mock achievements data
  const achievements = [
    { id: 1, title: 'Fast Learner', description: 'Completed 5 course modules in one day', date: '2023-05-20', icon: '🚀' },
    { id: 2, title: 'Perfect Score', description: 'Scored 100% on a quiz', date: '2023-06-05', icon: '🏆' },
    { id: 3, title: 'Consistent Learner', description: 'Logged in for 7 consecutive days', date: '2023-06-12', icon: '🔥' },
  ];

  return (
    <div className="learner-profile-section">
      <ProfileSection isEditable={isEditable} />
      
      <div className="learner-stats-section">
        <h3>Learning Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon courses-icon">📚</div>
            <div className="stat-content">
              <h4>Enrolled Courses</h4>
              <p className="stat-value">{learnerStats.enrolledCourses}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon completed-icon">✅</div>
            <div className="stat-content">
              <h4>Completed Courses</h4>
              <p className="stat-value">{learnerStats.completedCourses}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon certificate-icon">🎓</div>
            <div className="stat-content">
              <h4>Certificates Earned</h4>
              <p className="stat-value">{learnerStats.certificatesEarned}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon hours-icon">⏱️</div>
            <div className="stat-content">
              <h4>Hours Learned</h4>
              <p className="stat-value">{learnerStats.totalHoursLearned}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="learner-achievements-section">
        <h3>Recent Achievements</h3>
        <div className="achievements-list">
          {achievements.map(achievement => (
            <div key={achievement.id} className="achievement-item">
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
                <span className="achievement-date">{achievement.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="learning-goals">
        <h3>Learning Goals</h3>
        <div className="learning-goals-content">
          <p>Set your learning objectives and track your progress towards achieving them.</p>
          {/* This would be editable in a full implementation */}
        </div>
      </div>
    </div>
  );
};

export default LearnerProfileSection;
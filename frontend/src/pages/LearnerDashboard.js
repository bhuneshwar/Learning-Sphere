import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/dashboard.css';
import './LearnerDashboard.css';
import { signOut } from '../utils/authUtils';
// Removed duplicate import of useNavigate

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data - in a real app, this would come from an API
  const enrolledCourses = [
    { id: 1, title: 'React Fundamentals', instructor: 'John Doe', progress: 65, image: 'https://via.placeholder.com/150', lastAccessed: '2023-06-15' },
    { id: 2, title: 'Advanced JavaScript', instructor: 'Jane Smith', progress: 30, image: 'https://via.placeholder.com/150', lastAccessed: '2023-06-10' },
    { id: 3, title: 'Node.js Essentials', instructor: 'Mike Johnson', progress: 80, image: 'https://via.placeholder.com/150', lastAccessed: '2023-06-18' },
  ];

  const recommendedCourses = [
    { id: 4, title: 'MongoDB for Beginners', instructor: 'Sarah Williams', rating: 4.8, image: 'https://via.placeholder.com/150' },
    { id: 5, title: 'GraphQL Masterclass', instructor: 'David Brown', rating: 4.7, image: 'https://via.placeholder.com/150' },
    { id: 6, title: 'TypeScript Deep Dive', instructor: 'Emily Clark', rating: 4.9, image: 'https://via.placeholder.com/150' },
  ];

  const achievements = [
    { id: 1, title: 'Fast Learner', description: 'Completed 5 course modules in one day', date: '2023-05-20', icon: '🚀' },
    { id: 2, title: 'Perfect Score', description: 'Scored 100% on a quiz', date: '2023-06-05', icon: '🏆' },
    { id: 3, title: 'Consistent Learner', description: 'Logged in for 7 consecutive days', date: '2023-06-12', icon: '🔥' },
  ];

  const upcomingDeadlines = [
    { id: 1, title: 'JavaScript Assignment', course: 'Advanced JavaScript', dueDate: '2023-06-25' },
    { id: 2, title: 'React Project Submission', course: 'React Fundamentals', dueDate: '2023-07-01' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Continue Learning</h2>
                <button className="view-all-btn" onClick={() => setActiveTab('courses')}>View All</button>
              </div>
              <div className="course-cards">
                {enrolledCourses.slice(0, 2).map(course => (
                  <div key={course.id} className="course-card">
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div className="course-info">
                      <h3>{course.title}</h3>
                      <p className="instructor">Instructor: {course.instructor}</p>
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <span className="progress-text">{course.progress}% complete</span>
                      </div>
                      <button className="continue-btn" onClick={() => navigate(`/course/${course.id}`)}>Continue</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-section deadlines-section">
                <h2>Upcoming Deadlines</h2>
                {upcomingDeadlines.length > 0 ? (
                  <ul className="deadlines-list">
                    {upcomingDeadlines.map(deadline => (
                      <li key={deadline.id} className="deadline-item">
                        <div className="deadline-info">
                          <h4>{deadline.title}</h4>
                          <p>{deadline.course}</p>
                        </div>
                        <div className="deadline-date">
                          <span className="date">{deadline.dueDate}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-items">No upcoming deadlines</p>
                )}
              </div>

              <div className="dashboard-section achievements-section">
                <h2>Recent Achievements</h2>
                {achievements.length > 0 ? (
                  <ul className="achievements-list">
                    {achievements.slice(0, 2).map(achievement => (
                      <li key={achievement.id} className="achievement-item">
                        <div className="achievement-icon">{achievement.icon}</div>
                        <div className="achievement-info">
                          <h4>{achievement.title}</h4>
                          <p>{achievement.description}</p>
                          <span className="date">Earned on {achievement.date}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-items">No achievements yet</p>
                )}
                <button className="view-all-btn" onClick={() => setActiveTab('achievements')}>View All</button>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>Recommended For You</h2>
                <button className="view-all-btn" onClick={() => navigate('/courses')}>Browse Courses</button>
              </div>
              <div className="course-cards recommended-courses">
                {recommendedCourses.map(course => (
                  <div key={course.id} className="course-card recommended-card">
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div className="course-info">
                      <h3>{course.title}</h3>
                      <p className="instructor">Instructor: {course.instructor}</p>
                      <div className="course-rating">
                        <span className="stars">{'★'.repeat(Math.floor(course.rating))}{'☆'.repeat(5 - Math.floor(course.rating))}</span>
                        <span className="rating-value">{course.rating}</span>
                      </div>
                      <button className="enroll-btn" onClick={() => navigate(`/course/${course.id}`)}>View Course</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="dashboard-courses">
            <h2>My Enrolled Courses</h2>
            <div className="course-list">
              {enrolledCourses.map(course => (
                <div key={course.id} className="course-item">
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p className="instructor">Instructor: {course.instructor}</p>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
                      </div>
                      <span className="progress-text">{course.progress}% complete</span>
                    </div>
                    <p className="last-accessed">Last accessed: {course.lastAccessed}</p>
                  </div>
                  <div className="course-actions">
                    <button className="primary-btn" onClick={() => navigate(`/course/${course.id}`)}>Continue</button>
                    <button className="secondary-btn" onClick={() => navigate(`/course/${course.id}/materials`)}>Materials</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'achievements':
        return (
          <div className="dashboard-achievements">
            <h2>My Achievements</h2>
            <div className="achievements-grid">
              {achievements.map(achievement => (
                <div key={achievement.id} className="achievement-card">
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-content">
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <span className="achievement-date">Earned on {achievement.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="dashboard-settings">
            <h2>Learning Preferences</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Learning Reminder</label>
                <select defaultValue="daily">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email Notifications</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="email-notifications" defaultChecked />
                  <label htmlFor="email-notifications"></label>
                </div>
              </div>
              <div className="form-group">
                <label>Course Recommendations</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="course-recommendations" defaultChecked />
                  <label htmlFor="course-recommendations"></label>
                </div>
              </div>
              <button className="save-settings-btn">Save Preferences</button>
            </div>
          </div>
        );
      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <div className="learner-dashboard-container">
      <Header />
      <div className="dashboard-main">
        <div className="dashboard-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <span>JD</span>
            </div>
            <h3>John Doe</h3>
            <p>Learner</p>
          </div>
          <nav className="dashboard-nav">
            <ul>
              <li className={activeTab === 'overview' ? 'active' : ''}>
                <button onClick={() => setActiveTab('overview')}>
                  <i className="fas fa-home"></i> Overview
                </button>
              </li>
              <li className={activeTab === 'courses' ? 'active' : ''}>
                <button onClick={() => setActiveTab('courses')}>
                  <i className="fas fa-book"></i> My Courses
                </button>
              </li>
              <li className={activeTab === 'achievements' ? 'active' : ''}>
                <button onClick={() => setActiveTab('achievements')}>
                  <i className="fas fa-trophy"></i> Achievements
                </button>
              </li>
              <li className={activeTab === 'settings' ? 'active' : ''}>
                <button onClick={() => setActiveTab('settings')}>
                  <i className="fas fa-cog"></i> Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="dashboard-content">
          {renderTabContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LearnerDashboard;

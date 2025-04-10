import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InstructorProfileSection from '../components/InstructorProfileSection';
import '../styles/dashboard.css';
import './InstructorDashboard.css';
import { signOut } from '../utils/authUtils';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const user = useSelector((state) => state.auth?.user) || JSON.parse(localStorage.getItem('user'));
  
  // Mock data - in a real app, this would come from an API
  const createdCourses = [
    { id: 1, title: 'React Fundamentals', students: 65, rating: 4.7, revenue: 1250, image: 'https://via.placeholder.com/150', lastUpdated: '2023-06-15' },
    { id: 2, title: 'Advanced JavaScript', students: 42, rating: 4.5, revenue: 980, image: 'https://via.placeholder.com/150', lastUpdated: '2023-06-10' },
    { id: 3, title: 'Node.js Essentials', students: 28, rating: 4.8, revenue: 750, image: 'https://via.placeholder.com/150', lastUpdated: '2023-06-18' },
  ];

  const courseAnalytics = [
    { id: 1, title: 'React Fundamentals', completionRate: 78, avgQuizScore: 85, studentEngagement: 92 },
    { id: 2, title: 'Advanced JavaScript', completionRate: 65, avgQuizScore: 79, studentEngagement: 84 },
    { id: 3, title: 'Node.js Essentials', completionRate: 82, avgQuizScore: 88, studentEngagement: 90 },
  ];

  const studentFeedback = [
    { id: 1, courseName: 'React Fundamentals', studentName: 'Alex Johnson', rating: 5, comment: 'Excellent course! The projects were challenging but very educational.', date: '2023-06-12' },
    { id: 2, courseName: 'Advanced JavaScript', studentName: 'Sarah Miller', rating: 4, comment: 'Great content, but could use more examples.', date: '2023-06-08' },
    { id: 3, courseName: 'Node.js Essentials', studentName: 'David Wilson', rating: 5, comment: 'This course helped me land a job! Thank you!', date: '2023-06-15' },
  ];

  const pendingTasks = [
    { id: 1, title: 'Grade React Final Projects', course: 'React Fundamentals', dueDate: '2023-06-25' },
    { id: 2, title: 'Respond to Student Questions', course: 'Advanced JavaScript', dueDate: '2023-06-22' },
    { id: 3, title: 'Update Course Materials', course: 'Node.js Essentials', dueDate: '2023-06-30' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <div className="dashboard-welcome">
              <h1>Welcome, {user?.firstName || 'Instructor'}!</h1>
              <p>Here's an overview of your teaching activity</p>
            </div>
            
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon students-icon">👨‍🎓</div>
                <div className="stat-content">
                  <h3>Total Students</h3>
                  <p className="stat-value">{createdCourses.reduce((total, course) => total + course.students, 0)}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon courses-icon">📚</div>
                <div className="stat-content">
                  <h3>Active Courses</h3>
                  <p className="stat-value">{createdCourses.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon revenue-icon">💰</div>
                <div className="stat-content">
                  <h3>Total Revenue</h3>
                  <p className="stat-value">${createdCourses.reduce((total, course) => total + course.revenue, 0)}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon rating-icon">⭐</div>
                <div className="stat-content">
                  <h3>Average Rating</h3>
                  <p className="stat-value">
                    {(createdCourses.reduce((total, course) => total + course.rating, 0) / createdCourses.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2>Your Courses</h2>
                <button className="view-all-btn" onClick={() => setActiveTab('courses')}>View All</button>
              </div>
              <div className="course-cards">
                {createdCourses.slice(0, 2).map(course => (
                  <div key={course.id} className="course-card">
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div className="course-info">
                      <h3>{course.title}</h3>
                      <div className="course-meta">
                        <span><i className="fas fa-user-graduate"></i> {course.students} students</span>
                        <span><i className="fas fa-star"></i> {course.rating}</span>
                      </div>
                      <div className="course-revenue">
                        <span>Revenue: ${course.revenue}</span>
                      </div>
                      <button className="manage-btn" onClick={() => navigate(`/course/${course.id}/manage`)}>Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-section tasks-section">
                <h2>Pending Tasks</h2>
                {pendingTasks.length > 0 ? (
                  <ul className="tasks-list">
                    {pendingTasks.map(task => (
                      <li key={task.id} className="task-item">
                        <div className="task-info">
                          <h4>{task.title}</h4>
                          <p>{task.course}</p>
                        </div>
                        <div className="task-date">
                          <span className="date">Due: {task.dueDate}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-items">No pending tasks</p>
                )}
              </div>

              <div className="dashboard-section feedback-section">
                <h2>Recent Feedback</h2>
                {studentFeedback.length > 0 ? (
                  <ul className="feedback-list">
                    {studentFeedback.slice(0, 2).map(feedback => (
                      <li key={feedback.id} className="feedback-item">
                        <div className="feedback-rating">
                          {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                        </div>
                        <div className="feedback-info">
                          <h4>{feedback.courseName}</h4>
                          <p>"{feedback.comment}"</p>
                          <div className="feedback-meta">
                            <span className="student-name">- {feedback.studentName}</span>
                            <span className="date">{feedback.date}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-items">No feedback yet</p>
                )}
                <button className="view-all-btn" onClick={() => setActiveTab('feedback')}>View All</button>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="dashboard-courses">
            <h2>My Courses</h2>
            <div className="course-list">
              {createdCourses.map(course => (
                <div key={course.id} className="course-item">
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <div className="course-meta">
                      <span><i className="fas fa-user-graduate"></i> {course.students} students</span>
                      <span><i className="fas fa-star"></i> {course.rating}</span>
                      <span><i className="fas fa-dollar-sign"></i> ${course.revenue}</span>
                    </div>
                    <p className="last-updated">Last updated: {course.lastUpdated}</p>
                  </div>
                  <div className="course-actions">
                    <button className="primary-btn" onClick={() => navigate(`/course/${course.id}/manage`)}>Manage</button>
                    <button className="secondary-btn" onClick={() => navigate(`/course/${course.id}/analytics`)}>Analytics</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="create-course-btn" onClick={() => navigate('/create-course')}>Create New Course</button>
          </div>
        );
      case 'analytics':
        return (
          <div className="dashboard-analytics">
            <h2>Course Analytics</h2>
            <div className="analytics-list">
              {courseAnalytics.map(course => (
                <div key={course.id} className="analytics-item">
                  <h3>{course.title}</h3>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <h4>Completion Rate</h4>
                      <div className="progress-circle">
                        <div className="progress-value">{course.completionRate}%</div>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <h4>Avg. Quiz Score</h4>
                      <div className="progress-circle">
                        <div className="progress-value">{course.avgQuizScore}%</div>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <h4>Student Engagement</h4>
                      <div className="progress-circle">
                        <div className="progress-value">{course.studentEngagement}%</div>
                      </div>
                    </div>
                  </div>
                  <button className="view-details-btn" onClick={() => navigate(`/course/${course.id}/analytics`)}>View Detailed Analytics</button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className="dashboard-feedback">
            <h2>Student Feedback</h2>
            <div className="feedback-list-full">
              {studentFeedback.map(feedback => (
                <div key={feedback.id} className="feedback-card">
                  <div className="feedback-header">
                    <h3>{feedback.courseName}</h3>
                    <div className="feedback-rating">
                      {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                    </div>
                  </div>
                  <div className="feedback-body">
                    <p>"{feedback.comment}"</p>
                  </div>
                  <div className="feedback-footer">
                    <span className="student-name">- {feedback.studentName}</span>
                    <span className="date">{feedback.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return <InstructorProfileSection />;
      case 'settings':
        return (
          <div className="dashboard-settings">
            <h2>Instructor Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Email Notifications</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="email-notifications" defaultChecked />
                  <label htmlFor="email-notifications"></label>
                </div>
                <p className="setting-description">Receive email notifications about student enrollments and feedback</p>
              </div>
              
              <div className="form-group">
                <label>Payment Method</label>
                <select defaultValue="paypal">
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Course Visibility</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="course-visibility" defaultChecked />
                  <label htmlFor="course-visibility"></label>
                </div>
                <p className="setting-description">Make your courses visible in search results</p>
              </div>
              
              <button className="save-settings-btn">Save Settings</button>
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-sidebar">
          <div className="user-welcome">
            <div className="user-avatar">
              {user?.firstName?.charAt(0) || 'I'}
            </div>
            <h3>{user?.firstName} {user?.lastName || ''}</h3>
            <p>{user?.role || 'Instructor'}</p>
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
              <li className={activeTab === 'analytics' ? 'active' : ''}>
                <button onClick={() => setActiveTab('analytics')}>
                  <i className="fas fa-chart-bar"></i> Analytics
                </button>
              </li>
              <li className={activeTab === 'feedback' ? 'active' : ''}>
                <button onClick={() => setActiveTab('feedback')}>
                  <i className="fas fa-comment"></i> Feedback
                </button>
              </li>
              <li className={activeTab === 'profile' ? 'active' : ''}>
                <button onClick={() => setActiveTab('profile')}>
                  <i className="fas fa-user"></i> Profile
                </button>
              </li>
              <li className={activeTab === 'settings' ? 'active' : ''}>
                <button onClick={() => setActiveTab('settings')}>
                  <i className="fas fa-cog"></i> Settings
                </button>
              </li>
            </ul>
          </nav>
          <button className="logout-btn" onClick={() => signOut(navigate)}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
        <div className="dashboard-content">
          {renderTabContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstructorDashboard;

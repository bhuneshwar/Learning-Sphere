import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/dashboard.css';
import './InstructorDashboard.css';
import { signOut } from '../utils/authUtils';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
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
                          <span className="date">{task.dueDate}</span>
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
                          {Array(feedback.rating).fill('★').join('')}
                        </div>
                        <div className="feedback-info">
                          <h4>{feedback.studentName}</h4>
                          <p className="feedback-course">{feedback.courseName}</p>
                          <p className="feedback-comment">"{feedback.comment}"</p>
                          <span className="date">Received on {feedback.date}</span>
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
            <div className="section-header">
              <h2>Your Courses</h2>
              <button className="create-course-btn" onClick={() => navigate('/create-course')}>Create New Course</button>
            </div>
            <div className="course-list">
              {createdCourses.map(course => (
                <div key={course.id} className="course-item">
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <div className="course-meta-grid">
                      <div className="meta-item">
                        <span className="meta-label">Students</span>
                        <span className="meta-value">{course.students}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Rating</span>
                        <span className="meta-value">{course.rating} ★</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Revenue</span>
                        <span className="meta-value">${course.revenue}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Last Updated</span>
                        <span className="meta-value">{course.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="course-actions">
                    <button className="primary-btn" onClick={() => navigate(`/course/${course.id}/manage`)}>Manage</button>
                    <button className="secondary-btn" onClick={() => navigate(`/course/${course.id}/edit`)}>Edit</button>
                    <button className="secondary-btn" onClick={() => navigate(`/course/${course.id}/analytics`)}>Analytics</button>
                  </div>
                </div>
              ))}
            </div>
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
                    <div className="analytics-metric">
                      <h4>Completion Rate</h4>
                      <div className="metric-chart">
                        <div className="chart-bar">
                          <div className="chart-fill" style={{ width: `${course.completionRate}%` }}></div>
                        </div>
                        <span className="metric-value">{course.completionRate}%</span>
                      </div>
                    </div>
                    <div className="analytics-metric">
                      <h4>Average Quiz Score</h4>
                      <div className="metric-chart">
                        <div className="chart-bar">
                          <div className="chart-fill" style={{ width: `${course.avgQuizScore}%` }}></div>
                        </div>
                        <span className="metric-value">{course.avgQuizScore}%</span>
                      </div>
                    </div>
                    <div className="analytics-metric">
                      <h4>Student Engagement</h4>
                      <div className="metric-chart">
                        <div className="chart-bar">
                          <div className="chart-fill" style={{ width: `${course.studentEngagement}%` }}></div>
                        </div>
                        <span className="metric-value">{course.studentEngagement}%</span>
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
            <div className="feedback-grid">
              {studentFeedback.map(feedback => (
                <div key={feedback.id} className="feedback-card">
                  <div className="feedback-header">
                    <h3>{feedback.studentName}</h3>
                    <div className="feedback-rating">
                      {Array(feedback.rating).fill('★').join('')}
                      {Array(5 - feedback.rating).fill('☆').join('')}
                    </div>
                  </div>
                  <p className="feedback-course">{feedback.courseName}</p>
                  <p className="feedback-comment">"{feedback.comment}"</p>
                  <div className="feedback-footer">
                    <span className="date">{feedback.date}</span>
                    <button className="reply-btn">Reply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <div className="instructor-dashboard-container">
      <Header />
      <div className="dashboard-main">
        <div className="dashboard-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <span>JD</span>
            </div>
            <h3>John Doe</h3>
            <p>Instructor</p>
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
              <li>
                <button onClick={() => navigate('/create-course')}>
                  <i className="fas fa-plus"></i> Create Course
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InstructorDashboard;

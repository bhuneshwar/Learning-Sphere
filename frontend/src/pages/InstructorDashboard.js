import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import InstructorProfileSection from '../components/InstructorProfileSection';
import dashboardService from '../services/dashboardService';
import { useToast } from '../components/Toast/ToastContainer';
import './InstructorDashboard.css';
import { signOut } from '../utils/authUtils';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const user = useSelector((state) => state.auth?.user) || JSON.parse(localStorage.getItem('user'));
  
  // State for API data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { showToast } = useToast();

  // Enhanced mock data as fallback
  const mockData = {
    createdCourses: [
      {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        description: 'Master modern web development from HTML to React',
        students: 245,
        rating: 4.8,
        revenue: 8925,
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300',
        lastUpdated: '2 days ago',
        status: 'published',
        category: 'Web Development',
        totalLessons: 45,
        completionRate: 78,
        enrollmentTrend: '+15%'
      },
      {
        id: 2,
        title: 'Advanced React & Redux',
        description: 'Deep dive into React patterns and state management',
        students: 182,
        rating: 4.6,
        revenue: 5460,
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300',
        lastUpdated: '1 week ago',
        status: 'published',
        category: 'Web Development',
        totalLessons: 32,
        completionRate: 65,
        enrollmentTrend: '+8%'
      },
      {
        id: 3,
        title: 'Node.js & Express Masterclass',
        description: 'Build scalable backend applications with Node.js',
        students: 134,
        rating: 4.9,
        revenue: 4020,
        price: 69.99,
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300',
        lastUpdated: '3 days ago',
        status: 'published',
        category: 'Backend Development',
        totalLessons: 38,
        completionRate: 82,
        enrollmentTrend: '+22%'
      },
      {
        id: 4,
        title: 'Python for Data Science',
        description: 'Learn Python for data analysis and machine learning',
        students: 67,
        rating: 4.4,
        revenue: 2010,
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300',
        lastUpdated: '5 days ago',
        status: 'draft',
        category: 'Data Science',
        totalLessons: 28,
        completionRate: 71,
        enrollmentTrend: '+5%'
      }
    ],
    revenueData: {
      total: 20415,
      thisMonth: 3240,
      lastMonth: 2890,
      growth: '+12.1%',
      chartData: [
        { month: 'Jan', revenue: 1250 },
        { month: 'Feb', revenue: 1850 },
        { month: 'Mar', revenue: 2100 },
        { month: 'Apr', revenue: 2890 },
        { month: 'May', revenue: 3240 },
        { month: 'Jun', revenue: 2950 }
      ]
    },
    studentAnalytics: {
      totalStudents: 628,
      activeStudents: 453,
      newEnrollments: 42,
      averageProgress: 67,
      topPerformingStudents: [
        { name: 'Alice Johnson', course: 'Web Development Bootcamp', progress: 95, score: 98 },
        { name: 'Bob Smith', course: 'React & Redux', progress: 88, score: 94 },
        { name: 'Carol Davis', course: 'Node.js Masterclass', progress: 92, score: 91 }
      ]
    },
    quizzes: [
      {
        id: 1,
        title: 'React Fundamentals Quiz',
        course: 'Web Development Bootcamp',
        questions: 15,
        averageScore: 84,
        completionRate: 92,
        createdDate: '2024-01-15',
        status: 'active'
      },
      {
        id: 2,
        title: 'JavaScript ES6+ Assessment',
        course: 'React & Redux',
        questions: 20,
        averageScore: 78,
        completionRate: 87,
        createdDate: '2024-01-10',
        status: 'active'
      },
      {
        id: 3,
        title: 'Node.js Express Basics',
        course: 'Node.js Masterclass',
        questions: 12,
        averageScore: 91,
        completionRate: 94,
        createdDate: '2024-01-20',
        status: 'active'
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Build a React E-commerce Site',
        course: 'Web Development Bootcamp',
        submissions: 89,
        totalStudents: 245,
        averageGrade: 85,
        dueDate: '2024-02-15',
        status: 'active'
      },
      {
        id: 2,
        title: 'Redux Todo Application',
        course: 'React & Redux',
        submissions: 156,
        totalStudents: 182,
        averageGrade: 78,
        dueDate: '2024-02-20',
        status: 'active'
      }
    ],
    studentFeedback: [
      {
        id: 1,
        courseName: 'Web Development Bootcamp',
        studentName: 'Alex Johnson',
        studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        rating: 5,
        comment: 'Excellent course! The projects were challenging but very educational. The instructor explains complex concepts clearly.',
        date: '2024-01-20',
        helpful: 12
      },
      {
        id: 2,
        courseName: 'React & Redux',
        studentName: 'Sarah Miller',
        studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        rating: 4,
        comment: 'Great content and structure. The Redux section was particularly helpful for my current project.',
        date: '2024-01-18',
        helpful: 8
      },
      {
        id: 3,
        courseName: 'Node.js Masterclass',
        studentName: 'David Wilson',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        rating: 5,
        comment: 'This course helped me land a backend developer job! The practical approach and real-world examples are amazing.',
        date: '2024-01-15',
        helpful: 15
      },
      {
        id: 4,
        courseName: 'Web Development Bootcamp',
        studentName: 'Emily Chen',
        studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        rating: 5,
        comment: 'Comprehensive and well-structured. Perfect for beginners looking to become full-stack developers.',
        date: '2024-01-12',
        helpful: 9
      }
    ],
    pendingTasks: [
      {
        id: 1,
        title: 'Review React Project Submissions',
        course: 'Web Development Bootcamp',
        dueDate: '2024-02-15',
        priority: 'high',
        type: 'grading',
        count: 23
      },
      {
        id: 2,
        title: 'Update Course Materials',
        course: 'React & Redux',
        dueDate: '2024-02-20',
        priority: 'medium',
        type: 'content',
        count: 1
      },
      {
        id: 3,
        title: 'Respond to Student Questions',
        course: 'Node.js Masterclass',
        dueDate: '2024-02-12',
        priority: 'high',
        type: 'support',
        count: 7
      },
      {
        id: 4,
        title: 'Create New Quiz',
        course: 'Python for Data Science',
        dueDate: '2024-02-25',
        priority: 'low',
        type: 'content',
        count: 1
      }
    ],
    courseAnalytics: [
      {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        completionRate: 78,
        avgQuizScore: 84,
        studentEngagement: 85
      },
      {
        id: 2,
        title: 'Advanced React & Redux',
        completionRate: 65,
        avgQuizScore: 78,
        studentEngagement: 72
      },
      {
        id: 3,
        title: 'Node.js & Express Masterclass',
        completionRate: 82,
        avgQuizScore: 91,
        studentEngagement: 88
      },
      {
        id: 4,
        title: 'Python for Data Science',
        completionRate: 71,
        avgQuizScore: 76,
        studentEngagement: 79
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'enrollment',
        message: 'Sarah Johnson enrolled in Web Development Bootcamp',
        timestamp: '2 hours ago'
      },
      {
        id: 2,
        type: 'submission',
        message: 'New assignment submission for React Project',
        timestamp: '4 hours ago'
      },
      {
        id: 3,
        type: 'feedback',
        message: 'New 5-star review for Node.js Masterclass',
        timestamp: '1 day ago'
      },
      {
        id: 4,
        type: 'question',
        message: 'Student question in React & Redux course',
        timestamp: '2 days ago'
      }
    ]
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getInstructorDashboard();
        setDashboardData(data);
      } catch (err) {
        console.warn('Failed to fetch real dashboard data, using mock data:', err);
        setError('Using sample data - connect to backend for real data');
        setDashboardData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Use real data if available, otherwise fall back to mock data
  const createdCourses = dashboardData?.createdCourses || mockData.createdCourses;
  const courseAnalytics = dashboardData?.courseAnalytics || mockData.courseAnalytics;
  const studentFeedback = dashboardData?.studentFeedback || mockData.studentFeedback;
  const pendingTasks = dashboardData?.pendingTasks || mockData.pendingTasks;

  if (loading) {
    return (
      <div className="dashboard-container">
        <Header />
        <main className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner">Loading dashboard...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <div className="dashboard-welcome">
              <h1>Welcome, {user?.firstName || 'Instructor'}!</h1>
              <p>Here's an overview of your teaching activity</p>
              {error && <div className="info-message">{error}</div>}
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
              {courseAnalytics?.length > 0 ? (
                courseAnalytics.map(course => (
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
                ))
              ) : (
                <div className="no-items">
                  <p>No analytics data available</p>
                </div>
              )}
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

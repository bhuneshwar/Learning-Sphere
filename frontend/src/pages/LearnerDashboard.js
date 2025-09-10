import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LearnerProfileSection from '../components/LearnerProfileSection';
import dashboardService from '../services/dashboardService';
import api from '../services/apiConfig';
import { useToast } from '../components/Toast/ToastContainer';
import './LearnerDashboard.css';
import { signOut } from '../utils/authUtils';

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [instructorApplication, setInstructorApplication] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    experience: '',
    expertise: [],
    motivation: '',
    sampleCourseIdea: '',
    qualifications: '',
    linkedinProfile: '',
    portfolioWebsite: ''
  });
  const user = useSelector((state) => state.auth?.user) || JSON.parse(localStorage.getItem('user'));
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchDashboardData();
    fetchInstructorApplicationStatus();
  }, []);

  const fetchInstructorApplicationStatus = async () => {
    try {
      const response = await api.get('/instructor-applications/status');
      setInstructorApplication(response.data);
    } catch (error) {
      console.error('Error fetching instructor application status:', error);
      // Set default state if no application exists
      setInstructorApplication({
        application: { status: 'none' },
        capabilities: { canTeach: false, canLearn: true }
      });
    }
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/instructor-applications/apply', applicationData);
      showSuccess('Instructor application submitted successfully! We\'ll review it and get back to you soon.');
      setShowApplicationForm(false);
      fetchInstructorApplicationStatus(); // Refresh status
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit application');
    }
  };

  const handleApplicationInputChange = (field, value) => {
    setApplicationData({ ...applicationData, [field]: value });
  };

  const handleExpertiseChange = (expertise) => {
    setApplicationData({ ...applicationData, expertise });
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getLearnerDashboard();
      // Handle the nested response structure from our API
      const data = response.data || response;
      
      // Transform API response to match frontend expectations
      const transformedData = {
        stats: {
          totalCoursesEnrolled: data.stats?.totalEnrolledCourses || 0,
          totalCoursesCompleted: data.stats?.completedCourses || 0,
          totalHoursLearned: data.stats?.totalHoursStudied || 0,
          currentStreak: data.stats?.currentStreak || 0,
          totalPoints: data.stats?.totalPoints || 0,
          averageScore: 85, // Mock for now
          certificatesEarned: data.stats?.certificatesEarned || 0
        },
        enrolledCourses: (data.enrolledCourses || []).map(enrollmentData => {
          // Handle the case where course data might be nested in course property
          const course = enrollmentData.course || enrollmentData;
          return {
            id: course._id || course.id, // Use _id from MongoDB or fallback to id
            _id: course._id || course.id, // Keep both for compatibility
            title: course.title,
            description: course.description,
            instructor: course.instructor?.firstName + ' ' + course.instructor?.lastName || course.instructor || 'Unknown',
            instructorAvatar: course.instructor?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            progress: enrollmentData.progress || 0,
            totalLessons: course.totalLessons || 10, // Default if not provided
            completedLessons: Math.round((enrollmentData.progress || 0) * (course.totalLessons || 10) / 100),
            image: course.coverImage || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300',
            lastAccessed: enrollmentData.lastAccessed ? new Date(enrollmentData.lastAccessed).toLocaleString() : '1 day ago',
            duration: course.duration || course.totalDuration || '30 hours',
            category: course.category || 'General',
            difficulty: course.level || 'Intermediate'
          };
        }),
        recentCourses: (data.recentCourses || []).map(enrollmentData => {
          const course = enrollmentData.course || enrollmentData;
          return {
            id: course._id || course.id,
            _id: course._id || course.id,
            title: course.title,
            instructor: course.instructor?.firstName + ' ' + course.instructor?.lastName || 'Unknown',
            lastAccessed: enrollmentData.lastAccessed ? new Date(enrollmentData.lastAccessed).toLocaleString() : 'Recently'
          };
        }),
        user: data.user || {},
        // Add mock data for sections not yet implemented in API
        recommendedCourses: getMockData().recommendedCourses,
        achievements: getMockData().achievements,
        upcomingDeadlines: getMockData().upcomingDeadlines,
        recentActivities: getMockData().recentActivities
      };
      
      setDashboardData(transformedData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError('Failed to load dashboard data');
      // Fallback to mock data
      setDashboardData(getMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockData = () => ({
    enrolledCourses: [
      {
        id: 1,
        title: 'Complete Web Development Bootcamp',
        instructor: 'Sarah Johnson',
        instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        progress: 65,
        totalLessons: 45,
        completedLessons: 29,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300',
        lastAccessed: '2 hours ago',
        duration: '52 hours',
        category: 'Web Development',
        difficulty: 'Beginner'
      },
      {
        id: 2,
        title: 'Data Science & Machine Learning',
        instructor: 'Dr. Michael Chen',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        progress: 30,
        totalLessons: 38,
        completedLessons: 11,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300',
        lastAccessed: '1 day ago',
        duration: '45 hours',
        category: 'Data Science',
        difficulty: 'Intermediate'
      },
      {
        id: 3,
        title: 'Mobile App Development with React Native',
        instructor: 'Alex Rodriguez',
        instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        progress: 80,
        totalLessons: 32,
        completedLessons: 26,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300',
        lastAccessed: '3 hours ago',
        duration: '38 hours',
        category: 'Mobile Development',
        difficulty: 'Intermediate'
      },
    ],
    recommendedCourses: [
      {
        id: 4,
        title: 'Full-Stack JavaScript Development',
        instructor: 'Emma Wilson',
        rating: 4.9,
        students: 12420,
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300',
        duration: '42 hours',
        category: 'Web Development'
      },
      {
        id: 5,
        title: 'Advanced Python for AI',
        instructor: 'David Kim',
        rating: 4.8,
        students: 8950,
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300',
        duration: '55 hours',
        category: 'Artificial Intelligence'
      },
      {
        id: 6,
        title: 'UI/UX Design Masterclass',
        instructor: 'Lisa Chen',
        rating: 4.7,
        students: 15230,
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300',
        duration: '35 hours',
        category: 'Design'
      },
    ],
    achievements: [
      {
        id: 1,
        title: 'Fast Learner',
        description: 'Completed 5 course modules in one day',
        date: new Date('2023-12-20').toLocaleDateString(),
        icon: '🚀',
        rarity: 'rare',
        points: 250
      },
      {
        id: 2,
        title: 'Perfect Score',
        description: 'Scored 100% on a quiz',
        date: new Date('2023-12-05').toLocaleDateString(),
        icon: '🏆',
        rarity: 'epic',
        points: 500
      },
      {
        id: 3,
        title: 'Consistent Learner',
        description: 'Logged in for 7 consecutive days',
        date: new Date('2023-12-12').toLocaleDateString(),
        icon: '🔥',
        rarity: 'common',
        points: 100
      },
      {
        id: 4,
        title: 'Course Completer',
        description: 'Finished your first course',
        date: new Date('2023-12-01').toLocaleDateString(),
        icon: '✅',
        rarity: 'uncommon',
        points: 300
      },
    ],
    upcomingDeadlines: [
      {
        id: 1,
        title: 'JavaScript Final Project',
        course: 'Complete Web Development Bootcamp',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        priority: 'high',
        type: 'assignment'
      },
      {
        id: 2,
        title: 'Python Quiz #3',
        course: 'Data Science & Machine Learning',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        priority: 'medium',
        type: 'quiz'
      },
    ],
    stats: {
      totalCoursesEnrolled: 3,
      totalCoursesCompleted: 1,
      totalHoursLearned: 125,
      currentStreak: 7,
      totalPoints: 1150,
      averageScore: 87,
      certificatesEarned: 1
    },
    recentActivities: [
      {
        id: 1,
        type: 'lesson_completed',
        title: 'Completed "React Hooks Deep Dive"',
        course: 'Complete Web Development Bootcamp',
        timestamp: '2 hours ago'
      },
      {
        id: 2,
        type: 'quiz_passed',
        title: 'Passed "JavaScript Fundamentals Quiz" with 95%',
        course: 'Complete Web Development Bootcamp',
        timestamp: '1 day ago'
      },
      {
        id: 3,
        type: 'achievement_earned',
        title: 'Earned "Fast Learner" achievement',
        timestamp: '2 days ago'
      },
    ]
  });

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Header />
        <main className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const data = dashboardData || getMockData();
  const { enrolledCourses, recommendedCourses, achievements, upcomingDeadlines, stats, recentActivities } = data;
  
  // Ensure stats exists with default values
  const safeStats = stats || {
    totalCoursesEnrolled: 0,
    totalCoursesCompleted: 0,
    totalHoursLearned: 0,
    currentStreak: 0,
    totalPoints: 0,
    averageScore: 0,
    certificatesEarned: 0
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            {/* Welcome Header */}
            <div className="welcome-header">
              <div className="welcome-content">
                <h1 className="welcome-title">Welcome back, {user?.firstName || 'Learner'}!</h1>
                <p className="welcome-subtitle">
                  Ready to continue your learning journey? You've made great progress!
                </p>
              </div>
              <div className="streak-badge">
                <div className="streak-icon">🔥</div>
                <div className="streak-info">
                  <span className="streak-number">{safeStats.currentStreak}</span>
                  <span className="streak-label">Day Streak</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-icon" style={{background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))'}}>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{safeStats.totalCoursesEnrolled}</div>
                  <div className="stat-label">Active Courses</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background: 'linear-gradient(135deg, var(--secondary-500), var(--secondary-600))'}}>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{safeStats.totalCoursesCompleted}</div>
                  <div className="stat-label">Completed</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background: 'linear-gradient(135deg, var(--warning-500), var(--warning-600))'}}>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{safeStats.totalHoursLearned}h</div>
                  <div className="stat-label">Hours Learned</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{background: 'linear-gradient(135deg, var(--success-500), var(--success-600))'}}>
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{safeStats.totalPoints}</div>
                  <div className="stat-label">Points Earned</div>
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Continue Learning</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('courses')}>View All</button>
              </div>
              <div className="continue-learning-grid">
                {enrolledCourses.slice(0, 2).map(course => (
                  <div key={course.id} className="course-card-modern card">
                    <div className="course-image-modern">
                      <img src={course.image} alt={course.title} />
                      <div className="course-difficulty">{course.difficulty}</div>
                      <div className="course-category">{course.category}</div>
                    </div>
                    <div className="card-body">
                      <h3 className="course-title-modern">{course.title}</h3>
                      <div className="instructor-info">
                        <img src={course.instructorAvatar} alt={course.instructor} className="instructor-avatar" />
                        <span className="instructor-name">{course.instructor}</span>
                      </div>
                      <div className="progress-section">
                        <div className="progress-info">
                          <span className="progress-label">Progress</span>
                          <span className="progress-percentage">{course.progress}%</span>
                        </div>
                        <div className="progress-bar-modern">
                          <div className="progress-fill-modern" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <div className="lesson-progress">
                          {course.completedLessons} of {course.totalLessons} lessons completed
                        </div>
                      </div>
                      <div className="course-meta-info">
                        <span className="last-accessed">Last accessed: {course.lastAccessed}</span>
                        <span className="duration">{course.duration}</span>
                      </div>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-grid-modern">
              {/* Upcoming Deadlines */}
              <div className="dashboard-section deadlines-modern card">
                <div className="card-body">
                  <div className="section-icon-header">
                    <div className="section-icon warning">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3>Upcoming Deadlines</h3>
                  </div>
                  {upcomingDeadlines.length > 0 ? (
                    <div className="deadlines-list-modern">
                      {upcomingDeadlines.map(deadline => (
                        <div key={deadline.id} className={`deadline-item-modern priority-${deadline.priority}`}>
                          <div className="deadline-type-icon">
                            {deadline.type === 'assignment' ? '📝' : '❓'}
                          </div>
                          <div className="deadline-content">
                            <h4 className="deadline-title">{deadline.title}</h4>
                            <p className="deadline-course">{deadline.course}</p>
                            <div className="deadline-date-info">
                              <span className="due-date">Due: {deadline.dueDate}</span>
                              <span className={`priority-badge priority-${deadline.priority}`}>
                                {deadline.priority.toUpperCase()} PRIORITY
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">✅</div>
                      <p>No upcoming deadlines. Great job staying on track!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="dashboard-section activity-modern card">
                <div className="card-body">
                  <div className="section-icon-header">
                    <div className="section-icon activity">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3>Recent Activity</h3>
                  </div>
                  <div className="activity-list">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className={`activity-item activity-${activity.type}`}>
                        <div className="activity-icon">
                          {activity.type === 'lesson_completed' && '📚'}
                          {activity.type === 'quiz_passed' && '✅'}
                          {activity.type === 'achievement_earned' && '🏆'}
                        </div>
                        <div className="activity-content">
                          <p className="activity-title">{activity.title}</p>
                          {activity.course && <span className="activity-course">{activity.course}</span>}
                          <span className="activity-timestamp">{activity.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Application Section */}
            {instructorApplication && !instructorApplication.capabilities?.canTeach && (
              <div className="dashboard-section">
                <div className="instructor-application-card card">
                  <div className="card-body">
                    {instructorApplication.application?.status === 'none' && (
                      <div className="application-prompt">
                        <div className="application-icon">🎓</div>
                        <div className="application-content">
                          <h3>Ready to Share Your Knowledge?</h3>
                          <p>Join thousands of instructors on our platform and start teaching what you love. Help others learn while earning from your expertise.</p>
                          <div className="application-benefits">
                            <div className="benefit-item">
                              <span className="benefit-icon">💰</span>
                              <span>Earn from your courses</span>
                            </div>
                            <div className="benefit-item">
                              <span className="benefit-icon">🌟</span>
                              <span>Build your reputation</span>
                            </div>
                            <div className="benefit-item">
                              <span className="benefit-icon">🎯</span>
                              <span>Reach global audience</span>
                            </div>
                          </div>
                          <button 
                            className="btn btn-primary btn-lg" 
                            onClick={() => setShowApplicationForm(true)}
                          >
                            <i className="fas fa-graduation-cap"></i>
                            Become an Instructor
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {instructorApplication.application?.status === 'pending' && (
                      <div className="application-status pending">
                        <div className="status-icon">⏳</div>
                        <div className="status-content">
                          <h3>Application Under Review</h3>
                          <p>We've received your instructor application and are currently reviewing it. We'll get back to you within 2-3 business days.</p>
                          <div className="application-date">
                            Applied on: {new Date(instructorApplication.application.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {instructorApplication.application?.status === 'rejected' && (
                      <div className="application-status rejected">
                        <div className="status-icon">❌</div>
                        <div className="status-content">
                          <h3>Application Not Approved</h3>
                          <p>Unfortunately, we couldn't approve your instructor application at this time.</p>
                          {instructorApplication.application.rejectionReason && (
                            <div className="rejection-reason">
                              <strong>Reason:</strong> {instructorApplication.application.rejectionReason}
                            </div>
                          )}
                          <button 
                            className="btn btn-outline" 
                            onClick={() => setShowApplicationForm(true)}
                          >
                            Reapply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Courses */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Recommended For You</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/courses')}>Browse All</button>
              </div>
              <div className="recommended-courses-grid">
                {recommendedCourses.map(course => (
                  <div key={course.id} className="recommended-course-card card">
                    <div className="course-image-modern">
                      <img src={course.image} alt={course.title} />
                      <div className="course-price">${course.price}</div>
                    </div>
                    <div className="card-body">
                      <div className="course-category-tag">{course.category}</div>
                      <h3 className="course-title-modern">{course.title}</h3>
                      <p className="instructor-name">By {course.instructor}</p>
                      <div className="course-rating-section">
                        <div className="stars">
                          {'★'.repeat(Math.floor(course.rating))}
                        </div>
                        <span className="rating-value">{course.rating}</span>
                        <span className="student-count">({course.students.toLocaleString()} students)</span>
                      </div>
                      <div className="course-duration">{course.duration}</div>
                      <button 
                        className="btn btn-outline" 
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        View Course
                      </button>
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
      case 'profile':
        return <LearnerProfileSection />;
      case 'settings':
        return (
          <div className="dashboard-settings">
            <h2>Learning Preferences</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Email Notifications</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="email-notifications" defaultChecked />
                  <label htmlFor="email-notifications"></label>
                </div>
                <p className="setting-description">Receive email notifications about course updates and deadlines</p>
              </div>
              
              <div className="form-group">
                <label>Language</label>
                <select defaultValue="en">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Theme</label>
                <div className="theme-options">
                  <div className="theme-option active">
                    <div className="theme-preview light"></div>
                    <span>Light</span>
                  </div>
                  <div className="theme-option">
                    <div className="theme-preview dark"></div>
                    <span>Dark</span>
                  </div>
                </div>
              </div>
              
              <button className="save-settings-btn">Save Preferences</button>
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  const renderInstructorApplicationForm = () => {
    if (!showApplicationForm) return null;

    const expertiseOptions = [
      'Web Development', 'Data Science', 'Mobile Development', 'UI/UX Design',
      'Machine Learning', 'DevOps', 'Cybersecurity', 'Cloud Computing',
      'Blockchain', 'Digital Marketing', 'Business', 'Photography',
      'Video Editing', 'Graphic Design', 'Music Production', 'Writing'
    ];

    const handleExpertiseToggle = (skill) => {
      const currentExpertise = applicationData.expertise || [];
      const isSelected = currentExpertise.includes(skill);
      
      if (isSelected) {
        handleExpertiseChange(currentExpertise.filter(s => s !== skill));
      } else {
        handleExpertiseChange([...currentExpertise, skill]);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowApplicationForm(false)}>
        <div className="modal-content instructor-application-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Apply to Become an Instructor</h2>
            <button className="modal-close" onClick={() => setShowApplicationForm(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleApplicationSubmit} className="application-form">
            <div className="form-section">
              <h3>Tell us about your experience</h3>
              <div className="form-group">
                <label htmlFor="experience">Teaching/Professional Experience *</label>
                <textarea
                  id="experience"
                  value={applicationData.experience}
                  onChange={(e) => handleApplicationInputChange('experience', e.target.value)}
                  placeholder="Describe your teaching experience, professional background, or relevant expertise..."
                  required
                  rows={4}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Your Areas of Expertise</h3>
              <div className="form-group">
                <label>Select your expertise areas (choose at least one) *</label>
                <div className="expertise-grid">
                  {expertiseOptions.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      className={`expertise-tag ${(applicationData.expertise || []).includes(skill) ? 'selected' : ''}`}
                      onClick={() => handleExpertiseToggle(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Your Motivation</h3>
              <div className="form-group">
                <label htmlFor="motivation">Why do you want to teach on our platform? *</label>
                <textarea
                  id="motivation"
                  value={applicationData.motivation}
                  onChange={(e) => handleApplicationInputChange('motivation', e.target.value)}
                  placeholder="Share your passion for teaching and what drives you to help others learn..."
                  required
                  rows={4}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Course Ideas</h3>
              <div className="form-group">
                <label htmlFor="sampleCourseIdea">Sample Course Idea *</label>
                <textarea
                  id="sampleCourseIdea"
                  value={applicationData.sampleCourseIdea}
                  onChange={(e) => handleApplicationInputChange('sampleCourseIdea', e.target.value)}
                  placeholder="Describe a course you'd like to create. Include the target audience, key topics, and learning outcomes..."
                  required
                  rows={4}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Information</h3>
              <div className="form-group">
                <label htmlFor="qualifications">Qualifications & Certifications</label>
                <textarea
                  id="qualifications"
                  value={applicationData.qualifications}
                  onChange={(e) => handleApplicationInputChange('qualifications', e.target.value)}
                  placeholder="List your relevant degrees, certifications, awards, or other qualifications..."
                  rows={3}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="linkedinProfile">LinkedIn Profile</label>
                  <input
                    type="url"
                    id="linkedinProfile"
                    value={applicationData.linkedinProfile}
                    onChange={(e) => handleApplicationInputChange('linkedinProfile', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="portfolioWebsite">Portfolio/Website</label>
                  <input
                    type="url"
                    id="portfolioWebsite"
                    value={applicationData.portfolioWebsite}
                    onChange={(e) => handleApplicationInputChange('portfolioWebsite', e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowApplicationForm(false)}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!applicationData.experience || !applicationData.motivation || !applicationData.sampleCourseIdea || (applicationData.expertise || []).length === 0}
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <Header />
      {renderInstructorApplicationForm()}
      <main className="dashboard-main">
        <div className="dashboard-sidebar">
          <div className="user-welcome">
            <div className="user-avatar">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <h3>{user?.firstName} {user?.lastName || ''}</h3>
            <p>{user?.role || 'Learner'}</p>
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

export default LearnerDashboard;

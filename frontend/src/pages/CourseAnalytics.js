import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast/ToastContainer';
import api from '../services/apiConfig';
import './CourseAnalytics.css';

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { showError } = useToast();
  
  const [course, setCourse] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30d'); // 7d, 30d, 90d, 1y
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (courseId) {
      fetchCourseAnalytics();
    }
  }, [courseId, timeframe]);

  const fetchCourseAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const courseResponse = await api.get(`/courses/${courseId}`);
      setCourse(courseResponse.data.course || courseResponse.data);
      
      // Fetch analytics data
      const analyticsResponse = await api.get(`/courses/${courseId}/analytics`, {
        params: { timeframe }
      });
      setAnalytics(analyticsResponse.data);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showError('Failed to load course analytics');
      
      // Mock data for development
      setCourse({
        _id: courseId,
        title: 'Complete Web Development Bootcamp',
        category: 'Programming',
        level: 'Intermediate',
        price: 99.99,
        enrolledStudents: new Array(245),
        ratings: { average: 4.7, count: 89 }
      });
      
      setAnalytics({
        overview: {
          totalEnrollments: 245,
          activeStudents: 178,
          completionRate: 68,
          avgTimeToComplete: 28,
          revenue: 24225.55,
          refundRate: 2.1
        },
        enrollments: {
          thisMonth: 42,
          lastMonth: 38,
          growth: 10.5,
          dailyEnrollments: generateMockData(30, 0, 5)
        },
        engagement: {
          avgWatchTime: 82,
          lessonCompletionRate: 75,
          avgSessionDuration: 25,
          peakLearningHours: [19, 20, 21],
          weeklyEngagement: generateMockData(7, 60, 95)
        },
        revenue: {
          totalRevenue: 24225.55,
          monthlyRevenue: 4158.9,
          avgRevenuePerStudent: 98.88,
          conversionRate: 12.5,
          monthlyTrend: generateMockData(12, 2000, 5000)
        },
        studentProgress: {
          inProgress: 112,
          completed: 133,
          notStarted: 0,
          avgProgress: 73,
          progressDistribution: [
            { range: '0-25%', count: 25 },
            { range: '26-50%', count: 45 },
            { range: '51-75%', count: 42 },
            { range: '76-100%', count: 133 }
          ]
        },
        feedback: {
          avgRating: 4.7,
          ratingDistribution: [
            { stars: 5, count: 52 },
            { stars: 4, count: 28 },
            { stars: 3, count: 7 },
            { stars: 2, count: 1 },
            { stars: 1, count: 1 }
          ],
          recentReviews: [
            {
              student: 'Sarah Johnson',
              rating: 5,
              comment: 'Excellent course! Very comprehensive and well-structured.',
              date: '2023-12-15'
            },
            {
              student: 'Michael Chen',
              rating: 4,
              comment: 'Great content, could use more practical examples.',
              date: '2023-12-14'
            }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate mock data
  const generateMockData = (length, min, max) => {
    return Array.from({ length }, (_, i) => ({
      date: new Date(Date.now() - (length - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: Math.floor(Math.random() * (max - min + 1)) + min
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const renderOverview = () => (
    <div className="analytics-section">
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.overview.totalEnrollments}</div>
            <div className="metric-label">Total Enrollments</div>
            <div className="metric-change positive">
              +{analytics.enrollments.growth}% this month
            </div>
          </div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.overview.activeStudents}</div>
            <div className="metric-label">Active Students</div>
            <div className="metric-change">
              {formatPercentage((analytics.overview.activeStudents / analytics.overview.totalEnrollments) * 100)} engagement
            </div>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{formatPercentage(analytics.overview.completionRate)}</div>
            <div className="metric-label">Completion Rate</div>
            <div className="metric-change">
              Avg {analytics.overview.avgTimeToComplete} days
            </div>
          </div>
        </div>
        
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(analytics.overview.revenue)}</div>
            <div className="metric-label">Total Revenue</div>
            <div className="metric-change positive">
              {formatCurrency(analytics.revenue.monthlyRevenue)} this month
            </div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Daily Enrollments</h3>
            <p>Last 30 days</p>
          </div>
          <div className="chart-container">
            <div className="simple-chart">
              {analytics.enrollments.dailyEnrollments.map((data, index) => (
                <div 
                  key={index}
                  className="chart-bar"
                  style={{ height: `${(data.value / 5) * 100}%` }}
                  title={`${data.date}: ${data.value} enrollments`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Student Progress Distribution</h3>
            <p>Current status breakdown</p>
          </div>
          <div className="progress-breakdown">
            {analytics.studentProgress.progressDistribution.map((item, index) => (
              <div key={index} className="progress-item">
                <div className="progress-label">{item.range}</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(item.count / analytics.overview.totalEnrollments) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-count">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentEngagement = () => (
    <div className="analytics-section">
      <div className="engagement-metrics">
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">{formatPercentage(analytics.engagement.avgWatchTime)}</div>
            <div className="metric-label">Avg Watch Time</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-value">{formatPercentage(analytics.engagement.lessonCompletionRate)}</div>
            <div className="metric-label">Lesson Completion</div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🕐</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.engagement.avgSessionDuration}min</div>
            <div className="metric-label">Avg Session</div>
          </div>
        </div>
      </div>

      <div className="engagement-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Engagement</h3>
            <p>Average engagement by day of week</p>
          </div>
          <div className="weekly-chart">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="day-column">
                <div className="day-label">{day}</div>
                <div 
                  className="engagement-bar"
                  style={{ height: `${analytics.engagement.weeklyEngagement[index]?.value || 0}%` }}
                ></div>
                <div className="engagement-value">
                  {analytics.engagement.weeklyEngagement[index]?.value || 0}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Peak Learning Hours</h3>
            <p>Most active learning times</p>
          </div>
          <div className="hours-heatmap">
            {Array.from({ length: 24 }, (_, hour) => (
              <div 
                key={hour}
                className={`hour-block ${analytics.engagement.peakLearningHours.includes(hour) ? 'peak' : ''}`}
                title={`${hour}:00 - ${hour + 1}:00`}
              >
                {hour}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRevenueAnalytics = () => (
    <div className="analytics-section">
      <div className="revenue-metrics">
        <div className="metric-card large">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(analytics.revenue.totalRevenue)}</div>
            <div className="metric-label">Total Revenue</div>
            <div className="metric-subtext">
              {formatCurrency(analytics.revenue.avgRevenuePerStudent)} per student
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{formatPercentage(analytics.revenue.conversionRate)}</div>
            <div className="metric-label">Conversion Rate</div>
          </div>
        </div>
      </div>

      <div className="revenue-chart-card">
        <div className="chart-header">
          <h3>Monthly Revenue Trend</h3>
          <p>Revenue over the last 12 months</p>
        </div>
        <div className="revenue-chart">
          {analytics.revenue.monthlyTrend.map((data, index) => (
            <div key={index} className="revenue-bar-container">
              <div 
                className="revenue-bar"
                style={{ height: `${(data.value / 5000) * 100}%` }}
                title={`${data.date}: ${formatCurrency(data.value)}`}
              ></div>
              <div className="month-label">
                {new Date(data.date).toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudentFeedback = () => (
    <div className="analytics-section">
      <div className="feedback-overview">
        <div className="rating-summary">
          <div className="avg-rating">
            <div className="rating-value">{analytics.feedback.avgRating}</div>
            <div className="rating-stars">
              {'★'.repeat(Math.floor(analytics.feedback.avgRating))}
              {'☆'.repeat(5 - Math.floor(analytics.feedback.avgRating))}
            </div>
            <div className="rating-count">Based on {analytics.feedback.ratingDistribution.reduce((sum, r) => sum + r.count, 0)} reviews</div>
          </div>
          
          <div className="rating-breakdown">
            {analytics.feedback.ratingDistribution.map((rating) => (
              <div key={rating.stars} className="rating-row">
                <span className="rating-label">{rating.stars} ★</span>
                <div className="rating-bar">
                  <div 
                    className="rating-fill"
                    style={{ 
                      width: `${(rating.count / analytics.feedback.ratingDistribution.reduce((sum, r) => sum + r.count, 0)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="rating-count">{rating.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-reviews">
        <h3>Recent Reviews</h3>
        <div className="reviews-list">
          {analytics.feedback.recentReviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-header">
                <div className="student-info">
                  <div className="student-avatar">
                    {review.student.charAt(0)}
                  </div>
                  <div className="student-details">
                    <div className="student-name">{review.student}</div>
                    <div className="review-date">
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="review-rating">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <div className="review-comment">
                {review.comment}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetailedAnalytics = () => (
    <div className="analytics-section">
      <div className="detailed-metrics">
        <div className="table-card">
          <div className="table-header">
            <h3>Lesson Performance</h3>
            <p>Completion rates and engagement by lesson</p>
          </div>
          <div className="performance-table">
            <div className="table-header-row">
              <div className="table-cell">Lesson</div>
              <div className="table-cell">Views</div>
              <div className="table-cell">Completion</div>
              <div className="table-cell">Avg Watch Time</div>
              <div className="table-cell">Drop-off Rate</div>
            </div>
            {/* Mock lesson data */}
            {[
              { name: 'Introduction to Web Development', views: 245, completion: 95, watchTime: 92, dropOff: 5 },
              { name: 'HTML Fundamentals', views: 234, completion: 88, watchTime: 85, dropOff: 12 },
              { name: 'CSS Styling Basics', views: 221, completion: 82, watchTime: 78, dropOff: 18 },
              { name: 'JavaScript Essentials', views: 198, completion: 75, watchTime: 71, dropOff: 25 },
              { name: 'React Framework', views: 156, completion: 68, watchTime: 65, dropOff: 32 }
            ].map((lesson, index) => (
              <div key={index} className="table-row">
                <div className="table-cell lesson-name">{lesson.name}</div>
                <div className="table-cell">{lesson.views}</div>
                <div className="table-cell">
                  <div className="completion-indicator">
                    <div 
                      className="completion-bar"
                      style={{ width: `${lesson.completion}%` }}
                    ></div>
                    <span>{lesson.completion}%</span>
                  </div>
                </div>
                <div className="table-cell">{lesson.watchTime}%</div>
                <div className="table-cell">
                  <span className={`drop-off ${lesson.dropOff > 20 ? 'high' : lesson.dropOff > 10 ? 'medium' : 'low'}`}>
                    {lesson.dropOff}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'engagement', label: 'Engagement', icon: '💡' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'feedback', label: 'Feedback', icon: '⭐' },
    { id: 'detailed', label: 'Detailed', icon: '📈' }
  ];

  if (loading) {
    return (
      <div className="analytics-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="analytics-page">
        <Header />
        <div className="error-container">
          <h2>Course not found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/my-courses')}>
            Back to My Courses
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <Header />
      
      <div className="analytics-container">
        <div className="analytics-header">
          <div className="course-info">
            <button 
              className="back-btn"
              onClick={() => navigate('/my-courses')}
              title="Back to My Courses"
            >
              ← Back
            </button>
            <div className="course-details">
              <h1>{course.title}</h1>
              <div className="course-meta">
                <span className="course-category">{course.category}</span>
                <span className="course-level">{course.level}</span>
                <span className="course-price">{formatCurrency(course.price)}</span>
              </div>
            </div>
          </div>
          
          <div className="analytics-controls">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="timeframe-select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="btn btn-outline">
              📊 Export Report
            </button>
          </div>
        </div>

        <div className="analytics-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`analytics-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="analytics-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'engagement' && renderStudentEngagement()}
          {activeTab === 'revenue' && renderRevenueAnalytics()}
          {activeTab === 'feedback' && renderStudentFeedback()}
          {activeTab === 'detailed' && renderDetailedAnalytics()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseAnalytics;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/apiConfig';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ResourceRecommendation from '../components/ResourceRecommendation';
import AIAssistant from '../components/ai/AIAssistant';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);
  const isAuthenticated = !!token;
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
        
        // Check if user is enrolled
        if (isAuthenticated) {
          try {
            const enrollmentResponse = await api.get(`/enrollments/check/${id}`);
            setEnrollmentStatus(enrollmentResponse.data.status);
          } catch (err) {
            // Not enrolled or error checking
            setEnrollmentStatus('not-enrolled');
          }
        }
      } catch (err) {
        setError('Failed to load course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    try {
      setEnrolling(true);
      await api.post(`/courses/${id}/enroll`);
      setEnrollmentStatus('enrolled');
    } catch (err) {
      setError('Failed to enroll in the course');
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  const renderEnrollButton = () => {
    if (!isAuthenticated) {
      return (
        <button className="enroll-button" onClick={handleEnroll}>
          Login to Enroll
        </button>
      );
    }

    if (enrollmentStatus === 'enrolled') {
      return (
        <div className="enrolled-actions">
          <Link to={`/learn/${course._id}/0/0`} className="start-learning-button">
            Start Learning
          </Link>
          <div className="enrollment-status">
            <i className="fas fa-check-circle"></i> Enrolled
          </div>
        </div>
      );
    }

    if (course.instructor._id === user?._id) {
      return (
        <Link to={`/instructor/courses/${id}/edit`} className="edit-course-button">
          Edit Course
        </Link>
      );
    }

    return (
      <button 
        className="enroll-button" 
        onClick={handleEnroll} 
        disabled={enrolling}
      >
        {enrolling ? 'Enrolling...' : `Enroll Now ${course.price > 0 ? `- ₹${course.price}` : '- Free'}`}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="course-detail-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-page">
        <Header />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Course not found'}</p>
          <Link to="/courses" className="back-button">Back to Courses</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <Header />
      
      <div className="course-hero">
        <div className="course-hero-content">
          <div className="course-breadcrumb">
            <Link to="/courses">Courses</Link> / <span>{course.category}</span>
          </div>
          <h1>{course.title}</h1>
          <p className="course-short-description">{course.description.substring(0, 150)}...</p>
          
          <div className="course-meta-info">
            <div className="meta-item">
              <i className="fas fa-user"></i>
              <span>Instructor: {course.instructor.username}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-signal"></i>
              <span>Level: {course.level}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-clock"></i>
              <span>Duration: {course.duration} hours</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-users"></i>
              <span>Students: {course.enrollments || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="course-enrollment-card">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
          ) : (
            <div className="course-thumbnail-placeholder">
              <i className="fas fa-book"></i>
            </div>
          )}
          
          <div className="course-price-container">
            {parseInt(course.price) === 0 ? (
              <div className="course-price free">Free</div>
            ) : (
              <div className="course-price">₹{course.price}</div>
            )}
          </div>
          
          {renderEnrollButton()}
          
          <div className="course-includes">
            <h4>This course includes:</h4>
            <ul>
              <li><i className="fas fa-video"></i> {course.sections.reduce((total, section) => total + section.lessons.length, 0)} lessons</li>
              <li><i className="fas fa-clock"></i> {course.duration} hours of content</li>
              <li><i className="fas fa-infinity"></i> Full lifetime access</li>
              <li><i className="fas fa-mobile-alt"></i> Access on mobile and desktop</li>
              <li><i className="fas fa-certificate"></i> Certificate of completion</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="course-detail-container">
        <div className="course-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'curriculum' ? 'active' : ''}`}
            onClick={() => setActiveTab('curriculum')}
          >
            Curriculum
          </button>
          <button 
            className={`tab-button ${activeTab === 'instructor' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructor')}
          >
            Instructor
          </button>
        </div>
        
        <div className="course-tab-content">
          {activeTab === 'overview' && (
            <div className="course-overview">
              <div className="course-description">
                <h3>About This Course</h3>
                <p>{course.description}</p>
              </div>
              
              <div className="course-learning-objectives">
                <h3>What You'll Learn</h3>
                <ul>
                  {course.learningObjectives && course.learningObjectives.map((objective, index) => (
                    <li key={index}><i className="fas fa-check"></i> {objective}</li>
                  ))}
                </ul>
              </div>
              
              {course.prerequisites && (
                <div className="course-prerequisites">
                  <h3>Prerequisites</h3>
                  <p>{course.prerequisites}</p>
                </div>
              )}
              
              {/* Resource Recommendations */}
              {enrollmentStatus === 'enrolled' && (
                <ResourceRecommendation courseId={id} />
              )}
            </div>
          )}
          
          {activeTab === 'curriculum' && (
            <div className="course-curriculum">
              <h3>Course Content</h3>
              <div className="curriculum-summary">
                <span>{course.sections.length} sections</span>
                <span>•</span>
                <span>{course.sections.reduce((total, section) => total + section.lessons.length, 0)} lessons</span>
                <span>•</span>
                <span>{course.duration} total hours</span>
              </div>
              
              <div className="curriculum-sections">
                {course.sections.map((section, sectionIndex) => (
                  <div className="curriculum-section" key={sectionIndex}>
                    <div 
                      className="section-header"
                      onClick={() => setActiveSection(activeSection === sectionIndex ? -1 : sectionIndex)}
                    >
                      <div className="section-title">
                        <i className={`fas ${activeSection === sectionIndex ? 'fa-minus' : 'fa-plus'}`}></i>
                        <h4>Section {sectionIndex + 1}: {section.title}</h4>
                      </div>
                      <div className="section-details">
                        <span>{section.lessons.length} lessons</span>
                        <span>{section.lessons.reduce((total, lesson) => total + parseInt(lesson.duration || 0), 0)} min</span>
                      </div>
                    </div>
                    
                    {activeSection === sectionIndex && (
                      <div className="section-lessons">
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div className="lesson-item" key={lessonIndex}>
                            <div className="lesson-icon">
                              <i className="fas fa-play-circle"></i>
                            </div>
                            <div className="lesson-details">
                              <h5>{lesson.title}</h5>
                              {lesson.duration && <span>{lesson.duration} min</span>}
                            </div>
                            {enrollmentStatus === 'enrolled' ? (
                              <Link to={`/learn/${course._id}/${sectionIndex}/${lessonIndex}`} className="lesson-preview">
                                <i className="fas fa-eye"></i>
                              </Link>
                            ) : (
                              <div className="lesson-locked">
                                <i className="fas fa-lock"></i>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'instructor' && (
            <div className="course-instructor-info">
              <h3>About the Instructor</h3>
              
              <div className="instructor-profile">
                <div className="instructor-avatar">
                  {course.instructor.profilePicture ? (
                    <img src={course.instructor.profilePicture} alt={course.instructor.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {course.instructor.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="instructor-details">
                  <h4>{course.instructor.username}</h4>
                  <p className="instructor-title">{course.instructor.title || 'Instructor'}</p>
                  
                  <div className="instructor-stats">
                    <div className="stat-item">
                      <span className="stat-value">{course.instructor.coursesCount || 1}</span>
                      <span className="stat-label">Courses</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{course.instructor.studentsCount || 0}</span>
                      <span className="stat-label">Students</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{course.instructor.reviewsCount || 0}</span>
                      <span className="stat-label">Reviews</span>
                    </div>
                  </div>
                  
                  {course.instructor.bio && (
                    <p className="instructor-bio">{course.instructor.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      
      {/* AI Assistant - only show for authenticated users */}
      {isAuthenticated && (
        <AIAssistant 
          courseId={id} 
          isOpen={false}
        />
      )}
    </div>
  );
};

export default CourseDetailPage;
import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course, showProgress = false }) => {
  const progressPercentage = course.progress || 0;
  const isInProgress = progressPercentage > 0;
  const isCompleted = progressPercentage >= 100;

  return (
    <div className="modern-course-card">
      {/* Course Thumbnail */}
      <div className="course-thumbnail">
        {course.coverImage || course.thumbnail ? (
          <img 
            src={course.coverImage || course.thumbnail} 
            alt={course.title}
            loading="lazy"
          />
        ) : (
          <div className="placeholder-thumbnail">
            <div className="placeholder-icon">📚</div>
          </div>
        )}
        
        {/* Course Level Badge */}
        <div className={`course-level-badge level-${course.level?.toLowerCase() || 'beginner'}`}>
          {course.level || 'Beginner'}
        </div>
        
        {/* Course Status */}
        {showProgress && (
          <div className={`course-status ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'not-started'}`}>
            {isCompleted ? '✓' : isInProgress ? '⏳' : '▶️'}
          </div>
        )}
      </div>
      
      {/* Course Content */}
      <div className="course-content">
        {/* Course Category */}
        <div className="course-category">
          {course.category || 'General'}
        </div>
        
        {/* Course Title */}
        <h3 className="course-title">
          {course.title}
        </h3>
        
        {/* Instructor Info */}
        <div className="course-instructor">
          <div className="instructor-avatar">
            {course.instructor?.firstName?.charAt(0) || course.instructor?.username?.charAt(0) || 'I'}
          </div>
          <span className="instructor-name">
            {course.instructor?.firstName && course.instructor?.lastName 
              ? `${course.instructor.firstName} ${course.instructor.lastName}`
              : course.instructor?.username || 'Instructor'}
          </span>
        </div>
        
        {/* Course Description */}
        <p className="course-description">
          {course.shortDescription || 
           (course.description?.length > 120 
             ? `${course.description.substring(0, 120)}...` 
             : course.description) || 
           'No description available'}
        </p>
        
        {/* Progress Bar */}
        {showProgress && (
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-text">Progress</span>
              <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Course Meta */}
        <div className="course-meta">
          <div className={`course-price ${parseInt(course.price) === 0 ? 'free' : ''}`}>
            {parseInt(course.price) === 0 ? 'Free' : `₹${course.price}`}
          </div>
          
          <div className="course-stats">
            {course.duration && (
              <div className="stat-item">
                <span className="stat-icon">🕒</span>
                <span>{course.duration}h</span>
              </div>
            )}
            {course.studentsEnrolled && (
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span>{course.studentsEnrolled}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Course Action */}
      <div className="course-action">
        <Link 
          to={`/courses/${course._id}`} 
          className="btn btn-primary course-action-btn"
        >
          {isCompleted ? 'Review Course' : isInProgress ? 'Continue Learning' : 'Start Learning'}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
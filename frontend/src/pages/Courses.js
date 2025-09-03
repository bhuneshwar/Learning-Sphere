import React, { useEffect, useState } from 'react';
import api from '../services/apiConfig';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        // Handle both array response and paginated response
        const courseData = response.data.courses || response.data;
        setCourses(Array.isArray(courseData) ? courseData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(course => course.category?.toLowerCase() === filter.toLowerCase());

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Available Courses</h1>
      <div>
        <label>Filter by category: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>
      </div>
      {filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course._id || course.id} className="course-card">
              {course.coverImage && (
                <img src={course.coverImage} alt={course.title} className="course-image" />
              )}
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="course-description">{course.shortDescription || course.description}</p>
                <div className="course-meta">
                  <p><strong>Category:</strong> {course.category}</p>
                  <p><strong>Level:</strong> {course.level}</p>
                  <p><strong>Price:</strong> ${course.price}</p>
                  {course.instructor && (
                    <p><strong>Instructor:</strong> {course.instructor.firstName} {course.instructor.lastName}</p>
                  )}
                  {course.ratings && (
                    <p><strong>Rating:</strong> {course.ratings.average}/5 ({course.ratings.count} reviews)</p>
                  )}
                  {course.totalLessons && (
                    <p><strong>Lessons:</strong> {course.totalLessons}</p>
                  )}
                  {course.totalDuration && (
                    <p><strong>Duration:</strong> {Math.round(course.totalDuration / 60)} hours</p>
                  )}
                </div>
                <button className="enroll-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default Courses;
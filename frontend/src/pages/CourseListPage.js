import React, { useEffect, useState } from 'react';
import axios from '../services/authService';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './CourseListPage.css';

const CourseListPage = () => {
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState({
        category: '',
        level: '',
        search: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams({
                    page,
                    ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
                });
                
                const response = await axios.get(`/courses?${queryParams}`);
                setCourses(response.data.courses);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [page, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setPage(1); // Reset to first page when filters change
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is already handled by the useEffect
    };

    const enrollInCourse = async (courseId) => {
        try {
            await axios.post(`/courses/${courseId}/enroll`);
            alert('Enrolled successfully');
        } catch (err) {
            console.error(err);
            alert('Error enrolling in course');
        }
    };

    return (
        <div className="course-list-page">
            <Header />
            
            <div className="course-list-container">
                <div className="course-list-header">
                    <h1>Explore Our Courses</h1>
                    <p>Discover a wide range of courses to enhance your skills and knowledge</p>
                </div>
                
                <div className="course-filters">
                    <div className="filter-group">
                        <label htmlFor="search">Search Courses</label>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by title or keyword"
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Categories</option>
                            <option value="Programming">Programming</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile Development">Mobile Development</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Design">Design</option>
                            <option value="Business">Business</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div className="filter-group">
                        <label htmlFor="level">Difficulty Level</label>
                        <select
                            id="level"
                            name="level"
                            value={filters.level}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading">Loading courses...</div>
                ) : courses.length > 0 ? (
                    <div className="course-grid">
                        {courses.map((course) => (
                            <div className="course-card" key={course._id}>
                                <div className="course-thumbnail">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} />
                                    ) : (
                                        <img src="/default-course-image.jpg" alt="Default course thumbnail" />
                                    )}
                                    <div className="course-level">{course.level}</div>
                                </div>
                                
                                <div className="course-content">
                                    <div className="course-category">{course.category}</div>
                                    <h3 className="course-title">{course.title}</h3>
                                    
                                    <div className="course-instructor">
                                        <div className="instructor-avatar">
                                            {course.instructor.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{course.instructor.username}</span>
                                    </div>
                                    
                                    <p className="course-description">
                                        {course.description.length > 120 
                                            ? `${course.description.substring(0, 120)}...` 
                                            : course.description}
                                    </p>
                                    
                                    <div className="course-meta">
                                        <div className={`course-price ${parseInt(course.price) === 0 ? 'free' : ''}`}>
                                            {parseInt(course.price) === 0 ? 'Free' : `$${course.price}`}
                                        </div>
                                        <div className="course-duration">
                                            <i className="fas fa-clock"></i> {course.duration} hours
                                        </div>
                                    </div>
                                    
                                    <Link to={`/courses/${course._id}`} className="enroll-button">
                                        View Course
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-courses">
                        <h3>No courses found</h3>
                        <p>Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}
                
                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            className="pagination-button" 
                            onClick={() => setPage(page - 1)} 
                            disabled={page === 1}
                        >
                            Previous
                        </button>
                        
                        <span className="pagination-info">
                            Page {page} of {totalPages}
                        </span>
                        
                        <button 
                            className="pagination-button" 
                            onClick={() => setPage(page + 1)} 
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
};

export default CourseListPage;
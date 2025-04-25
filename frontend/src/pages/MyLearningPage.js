import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MyLearningPage.css';

const MyLearningPage = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/enrollments/my-courses');
                setEnrolledCourses(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrolledCourses();
    }, []);

    return (
        <div className="my-learning-page">
            <Header />
            
            <div className="my-learning-container">
                <div className="my-learning-header">
                    <h1>My Learning</h1>
                    <p>Track your progress and continue learning</p>
                </div>
                
                {loading ? (
                    <div className="loading">Loading your courses...</div>
                ) : enrolledCourses.length > 0 ? (
                    <div className="enrolled-courses-grid">
                        {enrolledCourses.map((course) => (
                            <div className="enrolled-course-card" key={course._id}>
                                <div className="course-thumbnail">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} />
                                    ) : (
                                        <img src="/default-course-image.jpg" alt="Default course thumbnail" />
                                    )}
                                    <div className="course-progress">
                                        <div className="progress-bar" style={{ width: `${course.progress}%` }}></div>
                                        <span>{course.progress}% Complete</span>
                                    </div>
                                </div>
                                
                                <div className="course-content">
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="course-description">
                                        {course.description.length > 100 
                                            ? `${course.description.substring(0, 100)}...` 
                                            : course.description}
                                    </p>
                                    
                                    <div className="course-actions">
                                        <Link 
                                            to={`/courses/${course._id}`} 
                                            className="continue-button"
                                        >
                                            {course.progress > 0 ? 'Continue' : 'Start Learning'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-courses">
                        <h3>You haven't enrolled in any courses yet</h3>
                        <p>Explore our <Link to="/courses">course catalog</Link> to get started.</p>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
};

export default MyLearningPage;
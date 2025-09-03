import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/apiConfig';
import './HomePage.css';

const HomePage = () => {
    const [popularCourses, setPopularCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: '0',
        totalInstructors: '0', 
        totalStudents: '0',
        completionRate: '0%'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch popular courses
                const coursesResponse = await api.get('/courses', {
                    params: {
                        limit: 3,
                        sort: 'ratings.average',
                        order: 'desc'
                    }
                });
                const courseData = coursesResponse.data.courses || coursesResponse.data;
                setPopularCourses(Array.isArray(courseData) ? courseData.slice(0, 3) : []);
                
                // Try to fetch admin stats for real data
                try {
                    const statsResponse = await api.get('/admin/dashboard/stats');
                    if (statsResponse.data.stats) {
                        const { totalCourses, totalInstructors, totalUsers, totalLearners } = statsResponse.data.stats;
                        setStats({
                            totalCourses: totalCourses?.toLocaleString() + '+' || '1,200+',
                            totalInstructors: totalInstructors?.toLocaleString() + '+' || '500+', 
                            totalStudents: totalLearners?.toLocaleString() + '+' || '50,000+',
                            completionRate: '95%'
                        });
                    }
                } catch (statsError) {
                    // Keep default stats if admin endpoint fails
                    console.log('Using default stats (admin endpoint not accessible)');
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setPopularCourses([]);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const features = [
        {
            icon: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15a24.98 24.98 0 01-8-1.308z" />
                </svg>
            ),
            title: "Expert Instructors",
            description: "Learn from industry professionals with years of real-world experience and proven track records."
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            ),
            title: "Hands-on Projects",
            description: "Apply your knowledge through practical projects and real-world scenarios that build your portfolio."
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            title: "Verified Certificates",
            description: "Earn industry-recognized certificates to showcase your skills and advance your career."
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
            ),
            title: "Global Community",
            description: "Connect with learners worldwide and build your professional network through collaborative learning."
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            title: "Lifetime Access",
            description: "Get unlimited access to course materials and updates, allowing you to learn at your own pace."
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
            ),
            title: "24/7 Support",
            description: "Get help whenever you need it with our dedicated support team and active community forums."
        }
    ];


    return (
        <div className="home-page">
            <Header />
            
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <div className="hero-badge">
                                <span className="hero-badge-text">🚀 Transform your career with Learning Sphere</span>
                            </div>
                            <h1 className="hero-title">
                                Master New Skills with
                                <span className="hero-highlight"> World-Class Courses</span>
                            </h1>
                            <p className="hero-description">
                                Join our growing community of learners studying from industry experts. Get hands-on experience, 
                                build real projects, and earn certificates that employers recognize.
                            </p>
                            <div className="hero-buttons">
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Start Learning Today
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <Link to="/courses" className="btn btn-outline btn-lg">
                                    Browse Courses
                                </Link>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-number">{stats.totalStudents}</div>
                                    <div className="stat-label">Active Students</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{stats.totalInstructors}</div>
                                    <div className="stat-label">Expert Instructors</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{stats.totalCourses}</div>
                                    <div className="stat-label">Courses Available</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">{stats.completionRate}</div>
                                    <div className="stat-label">Completion Rate</div>
                                </div>
                            </div>
                        </div>
                        <div className="hero-visual">
                            <div className="hero-image">
                                <div className="floating-card floating-card-1">
                                    <div className="card-icon">📊</div>
                                    <div className="card-text">Analytics</div>
                                </div>
                                <div className="floating-card floating-card-2">
                                    <div className="card-icon">💻</div>
                                    <div className="card-text">Development</div>
                                </div>
                                <div className="floating-card floating-card-3">
                                    <div className="card-icon">🎨</div>
                                    <div className="card-text">Design</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose Learning Sphere?</h2>
                        <p className="section-description">
                            We provide everything you need to succeed in your learning journey
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card card">
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <div className="card-body">
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Popular Courses Section */}
            <section className="courses-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Most Popular Courses</h2>
                        <p className="section-description">
                            Start with these highly-rated courses chosen by thousands of students
                        </p>
                    </div>
                    {loading ? (
                        <div className="courses-grid">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="course-card card loading">
                                    <div className="loading-placeholder">Loading...</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="courses-grid">
                            {popularCourses.length > 0 ? popularCourses.map((course) => (
                                <div key={course._id} className="course-card card">
                                    <div className="course-image">
                                        <img 
                                            src={course.coverImage || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80'} 
                                            alt={course.title} 
                                        />
                                        <div className="course-level">{course.level}</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="course-meta">
                                            <div className="course-rating">
                                                <div className="stars">
                                                    {'★'.repeat(Math.floor(course.ratings?.average || 0))}
                                                    <span className="rating-text">{course.ratings?.average?.toFixed(1) || '0.0'}</span>
                                                </div>
                                                <span className="students-count">
                                                    ({(course.learners?.length || 0).toLocaleString()} students)
                                                </span>
                                            </div>
                                            <div className="course-duration">
                                                {course.totalDuration ? `${course.totalDuration} min` : 'N/A'}
                                            </div>
                                        </div>
                                        <h3 className="course-title">{course.title}</h3>
                                        <p className="course-description">
                                            {course.shortDescription || course.description?.substring(0, 100) + '...'}
                                        </p>
                                        <div className="course-instructor">
                                            By {course.instructor?.firstName} {course.instructor?.lastName || 'Instructor'}
                                        </div>
                                        <div className="course-footer">
                                            <div className="course-price">
                                                {course.price > 0 ? `₹${course.price}` : 'Free'}
                                            </div>
                                            <button className="btn btn-primary btn-sm">Enroll Now</button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="no-courses">
                                    <p>No courses available at the moment.</p>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="section-footer">
                        <Link to="/courses" className="btn btn-outline btn-lg">View All Courses</Link>
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Transform Your Career?</h2>
                        <p className="cta-description">
                            Join thousands of successful students who have advanced their careers with Learning Sphere.
                            Start your journey today with our expert-led courses.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get Started for Free
                            </Link>
                            <Link to="/login" className="btn btn-secondary btn-lg">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default HomePage;
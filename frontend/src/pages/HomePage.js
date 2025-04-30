import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <Header />
            
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Expand Your Knowledge with Learning Sphere</h1>
                    <p>Discover, learn, and grow with our interactive courses</p>
                    <div className="hero-buttons">
                        <Link to="/login" className="login-button">
                            <span>Get Started</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                        <Link to="/courses" className="explore-button">Browse Courses</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="gradient-overlay"></div>
                </div>
            </div>
            
            <div className="features-section">
                <h2>Why Choose Learning Sphere?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <h3>Expert Instructors</h3>
                        <p>Learn from industry professionals with years of experience.</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-laptop-code"></i>
                        </div>
                        <h3>Hands-on Learning</h3>
                        <p>Practical projects to apply what you learn.</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-certificate"></i>
                        </div>
                        <h3>Certification</h3>
                        <p>Earn certificates to showcase your skills.</p>
                    </div>
                </div>
            </div>
            
            <div className="popular-courses">
                <h2>Popular Courses</h2>
                <div className="courses-preview">
                    <div className="course-preview-card">
                        <div className="course-preview-thumbnail"></div>
                        <h3>Web Development Bootcamp</h3>
                        <p>Master modern web development technologies.</p>
                    </div>
                    
                    <div className="course-preview-card">
                        <div className="course-preview-thumbnail"></div>
                        <h3>Data Science Fundamentals</h3>
                        <p>Learn data analysis and visualization.</p>
                    </div>
                    
                    <div className="course-preview-card">
                        <div className="course-preview-thumbnail"></div>
                        <h3>Mobile App Development</h3>
                        <p>Build cross-platform mobile applications.</p>
                    </div>
                </div>
                <Link to="/courses" className="view-all-button">View All Courses</Link>
            </div>
            
            <Footer />
        </div>
    );
};

export default HomePage;
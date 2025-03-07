import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { signOut } from '../utils/authUtils';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user) || JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    signOut(navigate);
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container" onClick={navigateToDashboard}>
          <h1 className="logo">Learning Sphere</h1>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-links">
            <li><a href="/dashboard">Dashboard</a></li>
            {user?.role === 'Learner' && (
              <>
                <li><a href="/courses">Courses</a></li>
                <li><a href="/my-learning">My Learning</a></li>
              </>
            )}
            {user?.role === 'Instructor' && (
              <>
                <li><a href="/my-courses">My Courses</a></li>
                <li><a href="/create-course">Create Course</a></li>
                <li><a href="/analytics">Analytics</a></li>
              </>
            )}
          </ul>
        </nav>
        
        <div className="user-controls">
          <div className="user-profile" onClick={navigateToProfile}>
            <div className="avatar">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <span className="username">{user?.firstName || 'User'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { signOut } from '../utils/authUtils';
import NotificationCenter from './NotificationCenter/NotificationCenter';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user) || JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    signOut(navigate);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeDropdowns = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsNotificationOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo Section */}
        <Link to="/dashboard" className="brand-logo" onClick={closeDropdowns}>
          <div className="logo-icon">
            <span className="logo-symbol">📚</span>
          </div>
          <span className="brand-name">Learning Sphere</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-list">
            <li>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">🏠</span>
                Dashboard
              </Link>
            </li>
            {user?.role === 'Learner' && (
              <>
                <li>
                  <Link to="/courses" className="nav-link">
                    <span className="nav-icon">📖</span>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/my-learning" className="nav-link">
                    <span className="nav-icon">🎓</span>
                    My Learning
                  </Link>
                </li>
              </>
            )}
            {user?.role === 'Instructor' && (
              <>
                <li>
                  <Link to="/my-courses" className="nav-link">
                    <span className="nav-icon">📚</span>
                    My Courses
                  </Link>
                </li>
                <li>
                  <Link to="/create-course" className="nav-link">
                    <span className="nav-icon">➕</span>
                    Create Course
                  </Link>
                </li>
                <li>
                  <Link to="/analytics" className="nav-link">
                    <span className="nav-icon">📊</span>
                    Analytics
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* User Controls */}
        <div className="header-actions">
          {/* Notifications */}
          <button className="notification-btn" onClick={toggleNotifications}>
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>

          {/* User Profile Dropdown */}
          <div className={`user-dropdown ${isUserDropdownOpen ? 'active' : ''}`}>
            <button className="user-trigger" onClick={toggleUserDropdown}>
              <div className="user-avatar">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.firstName || 'User'}</span>
                <span className="user-role">{user?.role || 'Guest'}</span>
              </div>
              <span className="dropdown-arrow">⌄</span>
            </button>
            
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item" onClick={closeDropdowns}>
                <span className="dropdown-icon">👤</span>
                My Profile
              </Link>
              <Link to="/settings" className="dropdown-item" onClick={closeDropdowns}>
                <span className="dropdown-icon">⚙️</span>
                Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <span className="dropdown-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-list">
          <li>
            <Link to="/dashboard" className="mobile-nav-link" onClick={closeDropdowns}>
              <span className="nav-icon">🏠</span>
              Dashboard
            </Link>
          </li>
          {user?.role === 'Learner' && (
            <>
              <li>
                <Link to="/courses" className="mobile-nav-link" onClick={closeDropdowns}>
                  <span className="nav-icon">📖</span>
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/my-learning" className="mobile-nav-link" onClick={closeDropdowns}>
                  <span className="nav-icon">🎓</span>
                  My Learning
                </Link>
              </li>
            </>
          )}
          {user?.role === 'Instructor' && (
            <>
              <li>
                <Link to="/my-courses" className="mobile-nav-link" onClick={closeDropdowns}>
                  <span className="nav-icon">📚</span>
                  My Courses
                </Link>
              </li>
              <li>
                <Link to="/create-course" className="mobile-nav-link" onClick={closeDropdowns}>
                  <span className="nav-icon">➕</span>
                  Create Course
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="mobile-nav-link" onClick={closeDropdowns}>
                  <span className="nav-icon">📊</span>
                  Analytics
                </Link>
              </li>
            </>
          )}
          <li className="mobile-divider"></li>
          <li>
            <Link to="/profile" className="mobile-nav-link" onClick={closeDropdowns}>
              <span className="nav-icon">👤</span>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/settings" className="mobile-nav-link" onClick={closeDropdowns}>
              <span className="nav-icon">⚙️</span>
              Settings
            </Link>
          </li>
          <li>
            <button className="mobile-nav-link logout-mobile" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              Logout
            </button>
          </li>
        </ul>
      </div>
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useToast } from '../components/Toast/ToastContainer';
import { validateForm, registrationValidationRules } from '../utils/validation';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Learner', // Always default to learner - users can apply to become instructors later
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData, registrationValidationRules);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      showError('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);

    try {
      await registerUser(formData);
      showSuccess('Registration successful! Please log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side - Branding */}
        <div className="auth-brand">
          <div className="brand-content">
            <div className="brand-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4L36 12V28C36 30.2 34.2 32 32 32H8C5.8 32 4 30.2 4 28V12L20 4Z" fill="currentColor"/>
                  <path d="M12 18V24H16V18H12ZM18 14V24H22V14H18ZM24 20V24H28V20H24Z" fill="white"/>
                </svg>
              </div>
              <span className="brand-name">Learning Sphere</span>
            </div>
            <h1 className="brand-title">Join Our Community!</h1>
            <p className="brand-subtitle">
              Create your account and start your learning journey with expert instructors and comprehensive courses.
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <div className="feature-icon">🚀</div>
                <span>Start Learning Today</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📜</div>
                <span>Get Certified</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤝</div>
                <span>Join Community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={`input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email Address
                </label>
                <div className="input-container">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div className="input-container">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`input ${errors.password ? 'error' : ''}`}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <div className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="form-group info-section">
                <div className="info-card">
                  <div className="info-icon">🎓</div>
                  <div className="info-content">
                    <h3>Welcome to Learning Sphere!</h3>
                    <p>You'll start as a <strong>learner</strong> with access to all courses on our platform.</p>
                    <p className="highlight">Want to teach? You can apply to become an instructor after creating your account!</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

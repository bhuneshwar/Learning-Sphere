import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { loginSuccess } from '../store/authSlice';
import { useToast } from '../components/Toast/ToastContainer';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const data = await loginUser({ email, password });
            dispatch(loginSuccess(data));
            
            showSuccess(`Welcome back, ${data.user.firstName}!`);
            
            // Redirect based on user role
            setTimeout(() => {
                if (data.user.role === 'Admin') {
                    navigate('/admin');
                } else if (data.user.role === 'Instructor' || data.user.role === 'Learner') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            }, 1000);
        } catch (err) {
            showError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
                        <h1 className="brand-title">Welcome Back!</h1>
                        <p className="brand-subtitle">
                            Continue your learning journey with thousands of courses and expert instructors.
                        </p>
                        <div className="brand-features">
                            <div className="feature-item">
                                <div className="feature-icon">📚</div>
                                <span>1,200+ Courses</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">👨‍🏫</div>
                                <span>Expert Instructors</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">🏆</div>
                                <span>Certificates</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="auth-form-section">
                    <div className="auth-form-container">
                        <div className="form-header">
                            <h2>Sign In</h2>
                            <p>Enter your credentials to access your account</p>
                        </div>

                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="input-container">
                                    <input
                                        type="email"
                                        id="email"
                                        className="input"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    <div className="input-icon">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="password">
                                    Password
                                </label>
                                <div className="input-container">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className="input"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="input-icon-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <span className="checkmark"></span>
                                    <span>Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </Link>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary btn-lg"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>
                                Don't have an account?{' '}
                                <Link to="/register" className="auth-link">
                                    Create one here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

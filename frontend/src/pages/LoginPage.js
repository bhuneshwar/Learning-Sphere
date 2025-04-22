import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { loginSuccess } from '../store/authSlice';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState(''); // Changed from username to email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser({ email, password }); // Send email instead of username
            dispatch(loginSuccess(data)); // Dispatch user data to Redux
            // Redirect based on user role
            if (data.user.role === 'Admin') {
                navigate('/admin'); // Admin has its own dashboard
            } else if (data.user.role === 'Instructor' || data.user.role === 'Learner') {
                navigate('/dashboard'); // RoleBasedDashboard will handle both roles
            } else {
                navigate('/'); // Fallback or handle other roles
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label>Email</label> {/* Updated label */}
                    <input
                        type="email" // Updated input type to email
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>

                {/* Register button */}
                <button
                    type="button"
                    className="register-button"
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default LoginPage;

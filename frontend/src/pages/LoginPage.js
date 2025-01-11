import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/authService';
import { loginSuccess } from '../store/authSlice';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();


    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error
        if (!email.includes('@') || password.length < 6) {
            setError('Invalid email or password');
            return;
        }
        try {
            const { data } = await loginUser({ email, password });
            dispatch(loginSuccess(data));
            window.location.href = '/dashboard';
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
                    <label>Email</label>
                    <input
                        type="email"
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
                    onClick={() => (window.location.href = '/register')}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default LoginPage;

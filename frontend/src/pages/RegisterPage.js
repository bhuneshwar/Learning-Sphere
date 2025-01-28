import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import './RegisterPage.css'; // Create a corresponding CSS file

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Learner',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert('Registration successful. Please log in.');
      window.location.href = '/login';
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select 
              id="role" 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="role-select"
            >
              <option value="Learner">Learner</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>
          
          <button type="submit" className="submit-btn">Register</button>
        </form>
        
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
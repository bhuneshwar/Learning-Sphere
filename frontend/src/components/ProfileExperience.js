import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getUserExperience,
  addExperience,
  updateExperience,
  deleteExperience
} from '../services/profileService';
import '../styles/ProfileComponents.css';

const ProfileExperience = () => {
  const { token } = useSelector(state => state.auth);
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  // Fetch work experience when component mounts
  useEffect(() => {
    fetchWorkExperience();
  }, [token]);

  const fetchWorkExperience = async () => {
    try {
      setLoading(true);
      const data = await getUserExperience();
      setExperienceList(data);
      setError(null);
    } catch (err) {
      setError('Failed to load work experience');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // If current is checked, clear the end date
    if (name === 'current' && checked) {
      setFormData(prev => ({ ...prev, endDate: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setEditingExperience(null);
    setShowAddForm(false);
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addExperience(formData);
      resetForm();
      fetchWorkExperience();
    } catch (err) {
      setError('Failed to add work experience');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExperience = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateExperience(editingExperience._id, formData);
      resetForm();
      fetchWorkExperience();
    } catch (err) {
      setError('Failed to update work experience');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    if (!window.confirm('Are you sure you want to delete this work experience entry?')) return;
    
    try {
      setLoading(true);
      await deleteExperience(experienceId);
      fetchWorkExperience();
    } catch (err) {
      setError('Failed to delete work experience');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      title: experience.title,
      location: experience.location || '',
      startDate: experience.startDate ? experience.startDate.substring(0, 10) : '',
      endDate: experience.endDate ? experience.endDate.substring(0, 10) : '',
      current: experience.current || false,
      description: experience.description || ''
    });
    setShowAddForm(true);
  };

  if (loading && experienceList.length === 0) {
    return <div className="loading">Loading work experience...</div>;
  }

  return (
    <div className="profile-section experience-section">
      <div className="section-header">
        <h2>Work Experience</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Experience'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <form 
          className="experience-form"
          onSubmit={editingExperience ? handleUpdateExperience : handleAddExperience}
        >
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country (optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={formData.current}
                required={!formData.current}
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="current"
              name="current"
              checked={formData.current}
              onChange={handleInputChange}
            />
            <label htmlFor="current">I am currently working here</label>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe your responsibilities and achievements"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingExperience ? 'Update Experience' : 'Add Experience'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {experienceList.length > 0 ? (
        <div className="experience-list">
          {experienceList.map((experience) => (
            <div key={experience._id} className="experience-item">
              <div className="experience-content">
                <h3 className="title">{experience.title}</h3>
                <p className="company">{experience.company}</p>
                {experience.location && <p className="location">{experience.location}</p>}
                <p className="date">
                  {new Date(experience.startDate).toLocaleDateString()} - 
                  {experience.current ? 'Present' : new Date(experience.endDate).toLocaleDateString()}
                </p>
                {experience.description && (
                  <p className="description">{experience.description}</p>
                )}
              </div>
              <div className="experience-actions">
                <button 
                  className="edit-btn"
                  onClick={() => startEditing(experience)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteExperience(experience._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No work experience available. Add your work history to enhance your profile.</p>
      )}
    </div>
  );
};

export default ProfileExperience;
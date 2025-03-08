import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getUserEducation,
  addEducation,
  updateEducation,
  deleteEducation
} from '../services/profileService';
import '../styles/ProfileComponents.css';

const ProfileEducation = () => {
  const { token } = useSelector(state => state.auth);
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  // Fetch education history when component mounts
  useEffect(() => {
    fetchEducationHistory();
  }, [token]);

  const fetchEducationHistory = async () => {
    try {
      setLoading(true);
      const data = await getUserEducation();
      setEducationList(data);
      setError(null);
    } catch (err) {
      setError('Failed to load education history');
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
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setEditingEducation(null);
    setShowAddForm(false);
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addEducation(formData);
      resetForm();
      fetchEducationHistory();
    } catch (err) {
      setError('Failed to add education');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEducation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateEducation(editingEducation._id, formData);
      resetForm();
      fetchEducationHistory();
    } catch (err) {
      setError('Failed to update education');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    
    try {
      setLoading(true);
      await deleteEducation(educationId);
      fetchEducationHistory();
    } catch (err) {
      setError('Failed to delete education');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (education) => {
    setEditingEducation(education);
    setFormData({
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startDate: education.startDate ? education.startDate.substring(0, 10) : '',
      endDate: education.endDate ? education.endDate.substring(0, 10) : '',
      current: education.current || false,
      description: education.description || ''
    });
    setShowAddForm(true);
  };

  if (loading && educationList.length === 0) {
    return <div className="loading">Loading education history...</div>;
  }

  return (
    <div className="profile-section education-section">
      <div className="section-header">
        <h2>Education</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Education'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <form 
          className="education-form"
          onSubmit={editingEducation ? handleUpdateEducation : handleAddEducation}
        >
          <div className="form-group">
            <label htmlFor="institution">Institution</label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="degree">Degree</label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fieldOfStudy">Field of Study</label>
            <input
              type="text"
              id="fieldOfStudy"
              name="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleInputChange}
              required
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
            <label htmlFor="current">I am currently studying here</label>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingEducation ? 'Update Education' : 'Add Education'}
            </button>
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {educationList.length > 0 ? (
        <div className="education-list">
          {educationList.map((education) => (
            <div key={education._id} className="education-item">
              <div className="education-content">
                <h3 className="institution">{education.institution}</h3>
                <p className="degree">{education.degree} in {education.fieldOfStudy}</p>
                <p className="date">
                  {new Date(education.startDate).toLocaleDateString()} - 
                  {education.current ? 'Present' : new Date(education.endDate).toLocaleDateString()}
                </p>
                {education.description && (
                  <p className="description">{education.description}</p>
                )}
              </div>
              <div className="education-actions">
                <button 
                  className="edit-btn"
                  onClick={() => startEditing(education)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteEducation(education._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No education history available. Add your education details to enhance your profile.</p>
      )}
    </div>
  );
};

export default ProfileEducation;
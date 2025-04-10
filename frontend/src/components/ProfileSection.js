import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../services/profileService';
import '../styles/ProfileComponents.css';

const ProfileSection = ({ isEditable = true }) => {
  const { user, token } = useSelector((state) => state.auth) || { user: JSON.parse(localStorage.getItem('user')), token: localStorage.getItem('token') };
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    role: '',
    skills: [],
    interests: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setProfile(response);
      
      // Initialize form data with profile information
      setFormData({
        firstName: response.firstName || user?.firstName || '',
        lastName: response.lastName || user?.lastName || '',
        email: response.email || user?.email || '',
        bio: response.bio || '',
        role: response.role || user?.role || '',
        skills: response.skills || [],
        interests: response.interests || [],
        socialLinks: {
          linkedin: response.socialLinks?.linkedin || '',
          github: response.socialLinks?.github || '',
          twitter: response.socialLinks?.twitter || '',
          website: response.socialLinks?.website || ''
        }
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile information');
      
      // If profile fetch fails, initialize with user data from auth state
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          bio: '',
          role: user.role || '',
          skills: [],
          interests: [],
          socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            website: ''
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [name]: value
      }
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserProfile(formData);
      setIsEditing(false);
      fetchUserProfile(); // Refresh profile data
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="profile-section loading">Loading profile information...</div>;
  }

  return (
    <div className="profile-section">
      {error && <div className="error-message">{error}</div>}
      
      {!isEditing ? (
        <div className="profile-view">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>{formData.firstName} {formData.lastName}</h2>
              <p className="user-role">{formData.role}</p>
              <p className="user-email">{formData.email}</p>
            </div>
            {isEditable && (
              <button 
                className="edit-profile-btn" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="profile-body">
            <div className="profile-section-item">
              <h3>Bio</h3>
              <p>{formData.bio || 'No bio provided yet.'}</p>
            </div>
            
            <div className="profile-section-item">
              <h3>Skills</h3>
              {formData.skills.length > 0 ? (
                <div className="tags-container">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="tag">{skill}</span>
                  ))}
                </div>
              ) : (
                <p>No skills listed yet.</p>
              )}
            </div>
            
            <div className="profile-section-item">
              <h3>Interests</h3>
              {formData.interests.length > 0 ? (
                <div className="tags-container">
                  {formData.interests.map((interest, index) => (
                    <span key={index} className="tag">{interest}</span>
                  ))}
                </div>
              ) : (
                <p>No interests listed yet.</p>
              )}
            </div>
            
            <div className="profile-section-item">
              <h3>Social Links</h3>
              <div className="social-links">
                {formData.socialLinks.linkedin && (
                  <a href={formData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {formData.socialLinks.github && (
                  <a href={formData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                )}
                {formData.socialLinks.twitter && (
                  <a href={formData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                )}
                {formData.socialLinks.website && (
                  <a href={formData.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                )}
                {!formData.socialLinks.linkedin && 
                 !formData.socialLinks.github && 
                 !formData.socialLinks.twitter && 
                 !formData.socialLinks.website && (
                  <p>No social links provided yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Edit Profile</h2>
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="save-btn" disabled={loading}>Save Changes</button>
            </div>
          </div>
          
          <div className="profile-avatar-edit">
            <div className="avatar-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile Preview" />
              ) : profile?.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                </div>
              )}
            </div>
            <input 
              type="file" 
              id="profile-picture" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <label htmlFor="profile-picture" className="upload-btn">Upload Photo</label>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label>Skills</label>
            <div className="tags-input">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <button type="button" onClick={handleAddSkill}>Add</button>
            </div>
            <div className="tags-container">
              {formData.skills.map((skill, index) => (
                <div key={index} className="tag-item">
                  <span className="tag">{skill}</span>
                  <button type="button" className="remove-tag" onClick={() => handleRemoveSkill(skill)}>×</button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Interests</label>
            <div className="tags-input">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
              />
              <button type="button" onClick={handleAddInterest}>Add</button>
            </div>
            <div className="tags-container">
              {formData.interests.map((interest, index) => (
                <div key={index} className="tag-item">
                  <span className="tag">{interest}</span>
                  <button type="button" className="remove-tag" onClick={() => handleRemoveInterest(interest)}>×</button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label>Social Links</label>
            <div className="social-links-form">
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleSocialLinkChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="github">GitHub</label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={formData.socialLinks.github}
                  onChange={handleSocialLinkChange}
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleSocialLinkChange}
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Personal Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.socialLinks.website}
                  onChange={handleSocialLinkChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileSection;
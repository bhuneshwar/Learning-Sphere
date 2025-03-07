import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    skills: [],
    interests: [],
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    },
    preferences: {
      notifications: true,
      theme: 'light',
      language: 'en'
    }
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    badge: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        };

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, config);
        setProfile(res.data);
        setFormData({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          bio: res.data.bio || '',
          skills: res.data.skills || [],
          interests: res.data.interests || [],
          socialLinks: {
            linkedin: res.data.socialLinks?.linkedin || '',
            github: res.data.socialLinks?.github || '',
            twitter: res.data.socialLinks?.twitter || '',
            website: res.data.socialLinks?.website || ''
          },
          preferences: {
            notifications: res.data.preferences?.notifications ?? true,
            theme: res.data.preferences?.theme || 'light',
            language: res.data.preferences?.language || 'en'
          }
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    }
  }, [token]);

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

  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/profile`,
        formData,
        config
      );

      setProfile(res.data);
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setLoading(false);
    }
  };

  const addNewAchievement = async () => {
    if (!newAchievement.title.trim()) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/profile/achievements`,
        newAchievement,
        config
      );

      setProfile({
        ...profile,
        achievements: res.data
      });

      setNewAchievement({
        title: '',
        description: '',
        badge: ''
      });
    } catch (err) {
      console.error('Error adding achievement:', err);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!profile) {
    return <div className="error-message">Failed to load profile</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.firstName} {profile.lastName}</h1>
          <p className="profile-role">{profile.role}</p>
          <p className="profile-joined">Joined: {new Date(profile.dateJoined).toLocaleDateString()}</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <button className="cancel-edit-btn" onClick={() => {
              setIsEditing(false);
              setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                bio: profile.bio || '',
                skills: profile.skills || [],
                interests: profile.interests || [],
                socialLinks: {
                  linkedin: profile.socialLinks?.linkedin || '',
                  github: profile.socialLinks?.github || '',
                  twitter: profile.socialLinks?.twitter || '',
                  website: profile.socialLinks?.website || ''
                },
                preferences: {
                  notifications: profile.preferences?.notifications ?? true,
                  theme: profile.preferences?.theme || 'light',
                  language: profile.preferences?.language || 'en'
                }
              });
            }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="profile-completeness">
        <div className="completeness-bar">
          <div 
            className="completeness-progress" 
            style={{ width: `${profile.profileCompleteness}%` }}
          ></div>
        </div>
        <p>Profile Completeness: {profile.profileCompleteness}%</p>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="form-section">
            <h2>Personal Information</h2>
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
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h2>Skills</h2>
            <div className="skills-input-group">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
              />
              <button type="button" onClick={addSkill}>Add</button>
            </div>
            <div className="skills-list">
              {formData.skills.map((skill, index) => (
                <div key={index} className="skill-tag">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}>&times;</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>Interests</h2>
            <div className="interests-input-group">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest"
              />
              <button type="button" onClick={addInterest}>Add</button>
            </div>
            <div className="interests-list">
              {formData.interests.map((interest, index) => (
                <div key={index} className="interest-tag">
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)}>&times;</button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>Social Links</h2>
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

          <div className="form-section">
            <h2>Preferences</h2>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={formData.preferences.notifications}
                onChange={handlePreferenceChange}
              />
              <label htmlFor="notifications">Receive Notifications</label>
            </div>
            <div className="form-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                name="theme"
                value={formData.preferences.theme}
                onChange={handlePreferenceChange}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                name="language"
                value={formData.preferences.language}
                onChange={handlePreferenceChange}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-profile-btn">Save Profile</button>
          </div>
        </form>
      ) : (
        <div className="profile-content">
          <div className="profile-section">
            <h2>About Me</h2>
            <p>{profile.bio || 'No bio provided yet.'}</p>
          </div>

          <div className="profile-section">
            <h2>Skills</h2>
            <div className="skills-list">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">{skill}</div>
                ))
              ) : (
                <p>No skills added yet.</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>Interests</h2>
            <div className="interests-list">
              {profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest, index) => (
                  <div key={index} className="interest-tag">{interest}</div>
                ))
              ) : (
                <p>No interests added yet.</p>
              )}
            </div>
          </div>

          <div className="profile-section">
            <h2>Social Links</h2>
            <div className="social-links">
              {profile.socialLinks?.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              )}
              {profile.socialLinks?.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-github"></i> GitHub
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
              )}
              {profile.socialLinks?.website && (
                <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fas fa-globe"></i> Website
                </a>
              )}
              {!profile.socialLinks?.linkedin && !profile.socialLinks?.github && 
               !profile.socialLinks?.twitter && !profile.socialLinks?.website && (
                <p>No social links added yet.</p>
              )}
            </div>
          </div>

          {profile.achievements && profile.achievements.length > 0 && (
            <div className="profile-section">
              <h2>Achievements</h2>
              <div className="achievements-list">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-card">
                    {achievement.badge && (
                      <div className="achievement-badge">
                        <img src={achievement.badge} alt="Badge" />
                      </div>
                    )}
                    <div className="achievement-details">
                      <h3>{achievement.title}</h3>
                      <p>{achievement.description}</p>
                      <span className="achievement-date">
                        Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="profile-section">
            <h2>Add New Achievement</h2>
            <div className="achievement-form">
              <div className="form-group">
                <label htmlFor="achievementTitle">Title</label>
                <input
                  type="text"
                  id="achievementTitle"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                  placeholder="Achievement title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="achievementDescription">Description</label>
                <textarea
                  id="achievementDescription"
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                  placeholder="Describe your achievement"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="achievementBadge">Badge URL (optional)</label>
                <input
                  type="url"
                  id="achievementBadge"
                  value={newAchievement.badge}
                  onChange={(e) => setNewAchievement({...newAchievement, badge: e.target.value})}
                  placeholder="https://example.com/badge.png"
                />
              </div>
              <button type="button" onClick={addNewAchievement} className="add-achievement-btn">
                Add Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useToast } from '../components/Toast/ToastContainer';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  
  // Account Settings State
  const [accountSettings, setAccountSettings] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      courseUpdates: true,
      newCourses: true,
      announcements: true,
      marketing: false,
      weeklyDigest: true
    },
    pushNotifications: {
      assignments: true,
      deadlines: true,
      messages: true,
      courseReminders: true
    },
    frequency: 'immediate' // immediate, daily, weekly
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, friends, private
    showEmail: false,
    showProgress: true,
    showAchievements: true,
    allowMessages: true,
    showOnlineStatus: true,
    dataSharing: {
      analytics: true,
      marketing: false,
      research: false
    }
  });

  // Learning Preferences State
  const [learningPreferences, setLearningPreferences] = useState({
    defaultPlaybackSpeed: '1',
    autoPlay: true,
    closedCaptions: false,
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    learningGoals: {
      dailyGoal: 30, // minutes
      weeklyGoal: 180, // minutes
      enableReminders: true,
      reminderTime: '19:00'
    },
    difficulty: 'intermediate'
  });

  // Accessibility Settings State
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    colorBlindSupport: false
  });

  useEffect(() => {
    // Load user settings from API
    const loadUserSettings = async () => {
      try {
        // This would typically fetch from an API
        // For now, we'll use localStorage as a fallback
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setNotificationSettings(settings.notifications || notificationSettings);
          setPrivacySettings(settings.privacy || privacySettings);
          setLearningPreferences(settings.learning || learningPreferences);
          setAccessibilitySettings(settings.accessibility || accessibilitySettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadUserSettings();
  }, []);

  const handleAccountSettingChange = (field, value) => {
    setAccountSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (category, field, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handlePrivacyChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPrivacySettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPrivacySettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleLearningChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setLearningPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setLearningPreferences(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAccessibilityChange = (field, value) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async (settingsType) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for now
      const allSettings = {
        notifications: notificationSettings,
        privacy: privacySettings,
        learning: learningPreferences,
        accessibility: accessibilitySettings
      };
      localStorage.setItem('userSettings', JSON.stringify(allSettings));
      
      showSuccess(`${settingsType} settings saved successfully!`);
    } catch (error) {
      showError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = (settingsType) => {
    const confirmReset = window.confirm(`Are you sure you want to reset ${settingsType} settings to default?`);
    if (confirmReset) {
      switch (settingsType) {
        case 'notification':
          setNotificationSettings({
            emailNotifications: {
              courseUpdates: true,
              newCourses: true,
              announcements: true,
              marketing: false,
              weeklyDigest: true
            },
            pushNotifications: {
              assignments: true,
              deadlines: true,
              messages: true,
              courseReminders: true
            },
            frequency: 'immediate'
          });
          break;
        case 'privacy':
          setPrivacySettings({
            profileVisibility: 'public',
            showEmail: false,
            showProgress: true,
            showAchievements: true,
            allowMessages: true,
            showOnlineStatus: true,
            dataSharing: {
              analytics: true,
              marketing: false,
              research: false
            }
          });
          break;
        case 'learning':
          setLearningPreferences({
            defaultPlaybackSpeed: '1',
            autoPlay: true,
            closedCaptions: false,
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            learningGoals: {
              dailyGoal: 30,
              weeklyGoal: 180,
              enableReminders: true,
              reminderTime: '19:00'
            },
            difficulty: 'intermediate'
          });
          break;
        case 'accessibility':
          setAccessibilitySettings({
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false,
            screenReader: false,
            keyboardNavigation: false,
            colorBlindSupport: false
          });
          break;
        default:
          break;
      }
      showSuccess(`${settingsType} settings reset to default!`);
    }
  };

  const changePassword = async () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      showError('New passwords do not match!');
      return;
    }

    if (accountSettings.newPassword.length < 8) {
      showError('Password must be at least 8 characters long!');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Password changed successfully!');
      setAccountSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      showError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAccountSettings = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h3>Account Settings</h3>
        <p>Manage your account security and basic information</p>
      </div>

      <div className="settings-group">
        <h4>Email Address</h4>
        <div className="form-group">
          <input
            type="email"
            value={accountSettings.email}
            onChange={(e) => handleAccountSettingChange('email', e.target.value)}
            className="input"
          />
          <button className="btn btn-outline btn-sm">Update Email</button>
        </div>
      </div>

      <div className="settings-group">
        <h4>Change Password</h4>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={accountSettings.currentPassword}
            onChange={(e) => handleAccountSettingChange('currentPassword', e.target.value)}
            className="input"
            placeholder="Enter current password"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={accountSettings.newPassword}
            onChange={(e) => handleAccountSettingChange('newPassword', e.target.value)}
            className="input"
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={accountSettings.confirmPassword}
            onChange={(e) => handleAccountSettingChange('confirmPassword', e.target.value)}
            className="input"
            placeholder="Confirm new password"
          />
        </div>
        <button 
          className="btn btn-primary"
          onClick={changePassword}
          disabled={loading || !accountSettings.currentPassword || !accountSettings.newPassword}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </div>

      <div className="settings-group">
        <h4>Two-Factor Authentication</h4>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accountSettings.twoFactorEnabled}
              onChange={(e) => handleAccountSettingChange('twoFactorEnabled', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Enable two-factor authentication</span>
          </label>
        </div>
        <p className="settings-description">
          Add an extra layer of security to your account with two-factor authentication.
        </p>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h3>Notification Settings</h3>
        <p>Choose how and when you want to be notified</p>
      </div>

      <div className="settings-group">
        <h4>Email Notifications</h4>
        {Object.entries(notificationSettings.emailNotifications).map(([key, value]) => (
          <div key={key} className="toggle-group">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleNotificationChange('emailNotifications', key, e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="settings-group">
        <h4>Push Notifications</h4>
        {Object.entries(notificationSettings.pushNotifications).map(([key, value]) => (
          <div key={key} className="toggle-group">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleNotificationChange('pushNotifications', key, e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="settings-group">
        <h4>Notification Frequency</h4>
        <div className="form-group">
          <select
            value={notificationSettings.frequency}
            onChange={(e) => setNotificationSettings(prev => ({ ...prev, frequency: e.target.value }))}
            className="input"
          >
            <option value="immediate">Immediate</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Summary</option>
          </select>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          className="btn btn-primary"
          onClick={() => saveSettings('Notification')}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Notification Settings'}
        </button>
        <button 
          className="btn btn-outline"
          onClick={() => resetSettings('notification')}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h3>Privacy Settings</h3>
        <p>Control how your information is shared and who can see your activity</p>
      </div>

      <div className="settings-group">
        <h4>Profile Visibility</h4>
        <div className="form-group">
          <select
            value={privacySettings.profileVisibility}
            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            className="input"
          >
            <option value="public">Public - Anyone can see your profile</option>
            <option value="friends">Friends Only - Only people you follow</option>
            <option value="private">Private - Only you can see your profile</option>
          </select>
        </div>
      </div>

      <div className="settings-group">
        <h4>Profile Information</h4>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.showEmail}
              onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Show email address on profile</span>
          </label>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.showProgress}
              onChange={(e) => handlePrivacyChange('showProgress', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Show learning progress</span>
          </label>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.showAchievements}
              onChange={(e) => handlePrivacyChange('showAchievements', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Show achievements and certificates</span>
          </label>
        </div>
      </div>

      <div className="settings-group">
        <h4>Communication</h4>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.allowMessages}
              onChange={(e) => handlePrivacyChange('allowMessages', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Allow others to send you messages</span>
          </label>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.showOnlineStatus}
              onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Show when you're online</span>
          </label>
        </div>
      </div>

      <div className="settings-group">
        <h4>Data Sharing</h4>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.dataSharing.analytics}
              onChange={(e) => handlePrivacyChange('dataSharing.analytics', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Share usage data for analytics</span>
          </label>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.dataSharing.marketing}
              onChange={(e) => handlePrivacyChange('dataSharing.marketing', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Use data for marketing purposes</span>
          </label>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={privacySettings.dataSharing.research}
              onChange={(e) => handlePrivacyChange('dataSharing.research', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Share anonymized data for research</span>
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          className="btn btn-primary"
          onClick={() => saveSettings('Privacy')}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Privacy Settings'}
        </button>
        <button 
          className="btn btn-outline"
          onClick={() => resetSettings('privacy')}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  const renderLearningSettings = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h3>Learning Preferences</h3>
        <p>Customize your learning experience and set your goals</p>
      </div>

      <div className="settings-group">
        <h4>Video Player Settings</h4>
        <div className="form-group">
          <label>Default Playback Speed</label>
          <select
            value={learningPreferences.defaultPlaybackSpeed}
            onChange={(e) => handleLearningChange('defaultPlaybackSpeed', e.target.value)}
            className="input"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x (Normal)</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={learningPreferences.autoPlay}
              onChange={(e) => handleLearningChange('autoPlay', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Auto-play next lesson</span>
          </label>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={learningPreferences.closedCaptions}
              onChange={(e) => handleLearningChange('closedCaptions', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Enable closed captions by default</span>
          </label>
        </div>
      </div>

      <div className="settings-group">
        <h4>Learning Goals</h4>
        <div className="form-group">
          <label>Daily Learning Goal (minutes)</label>
          <input
            type="number"
            value={learningPreferences.learningGoals.dailyGoal}
            onChange={(e) => handleLearningChange('learningGoals.dailyGoal', parseInt(e.target.value))}
            className="input"
            min="5"
            max="480"
          />
        </div>
        <div className="form-group">
          <label>Weekly Learning Goal (minutes)</label>
          <input
            type="number"
            value={learningPreferences.learningGoals.weeklyGoal}
            onChange={(e) => handleLearningChange('learningGoals.weeklyGoal', parseInt(e.target.value))}
            className="input"
            min="30"
            max="3360"
          />
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={learningPreferences.learningGoals.enableReminders}
              onChange={(e) => handleLearningChange('learningGoals.enableReminders', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Enable daily learning reminders</span>
          </label>
        </div>
        {learningPreferences.learningGoals.enableReminders && (
          <div className="form-group">
            <label>Reminder Time</label>
            <input
              type="time"
              value={learningPreferences.learningGoals.reminderTime}
              onChange={(e) => handleLearningChange('learningGoals.reminderTime', e.target.value)}
              className="input"
            />
          </div>
        )}
      </div>

      <div className="settings-group">
        <h4>General Preferences</h4>
        <div className="form-group">
          <label>Preferred Language</label>
          <select
            value={learningPreferences.language}
            onChange={(e) => handleLearningChange('language', e.target.value)}
            className="input"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
        <div className="form-group">
          <label>Timezone</label>
          <select
            value={learningPreferences.timezone}
            onChange={(e) => handleLearningChange('timezone', e.target.value)}
            className="input"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
            <option value="Europe/Paris">Central European Time (CET)</option>
            <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
            <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Preferred Difficulty Level</label>
          <select
            value={learningPreferences.difficulty}
            onChange={(e) => handleLearningChange('difficulty', e.target.value)}
            className="input"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="mixed">Mixed Levels</option>
          </select>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          className="btn btn-primary"
          onClick={() => saveSettings('Learning')}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Learning Settings'}
        </button>
        <button 
          className="btn btn-outline"
          onClick={() => resetSettings('learning')}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="settings-section">
      <div className="settings-header">
        <h3>Accessibility Settings</h3>
        <p>Customize the interface to meet your accessibility needs</p>
      </div>

      <div className="settings-group">
        <h4>Display Settings</h4>
        <div className="form-group">
          <label>Font Size</label>
          <select
            value={accessibilitySettings.fontSize}
            onChange={(e) => handleAccessibilityChange('fontSize', e.target.value)}
            className="input"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accessibilitySettings.highContrast}
              onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">High contrast mode</span>
          </label>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accessibilitySettings.reducedMotion}
              onChange={(e) => handleAccessibilityChange('reducedMotion', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Reduce motion and animations</span>
          </label>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accessibilitySettings.colorBlindSupport}
              onChange={(e) => handleAccessibilityChange('colorBlindSupport', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Color blind friendly mode</span>
          </label>
        </div>
      </div>

      <div className="settings-group">
        <h4>Assistive Technology</h4>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accessibilitySettings.screenReader}
              onChange={(e) => handleAccessibilityChange('screenReader', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Screen reader optimizations</span>
          </label>
        </div>
        <div className="toggle-group">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={accessibilitySettings.keyboardNavigation}
              onChange={(e) => handleAccessibilityChange('keyboardNavigation', e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Enhanced keyboard navigation</span>
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          className="btn btn-primary"
          onClick={() => saveSettings('Accessibility')}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Accessibility Settings'}
        </button>
        <button 
          className="btn btn-outline"
          onClick={() => resetSettings('accessibility')}
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔐' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' }
  ];

  return (
    <div className="settings-page">
      <Header />
      
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and customize your learning experience</p>
        </div>

        <div className="settings-layout">
          <div className="settings-sidebar">
            <nav className="settings-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span className="nav-label">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="settings-content">
            {activeTab === 'account' && renderAccountSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
            {activeTab === 'learning' && renderLearningSettings()}
            {activeTab === 'accessibility' && renderAccessibilitySettings()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SettingsPage;

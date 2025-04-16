import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { ErrorMessage, LoadingSpinner } from '../error/ErrorAndLoading';
import { updateUserProfile, getUserStats } from '../../store/actions';

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, loading, error } = useSelector(state => state.auth);
  const { userStats, statsLoading, statsError } = useSelector(state => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    preferredUnits: 'metric'
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        preferredUnits: user.preferredUnits || 'metric'
      });
      
      dispatch(getUserStats());
    }
  }, [dispatch, user]);
  
  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }
  
  // Handle input change for profile form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle input change for password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: ''
      });
    }
  };
  
  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Username is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    try {
      await dispatch(updateUserProfile(formData));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setFormErrors({
        general: error.message || 'Failed to update profile. Please try again.'
      });
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      await dispatch(updateUserProfile({ password: passwordData.newPassword }, passwordData.currentPassword));
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Failed to update password:', error);
      setPasswordErrors({
        general: error.message || 'Failed to update password. Please try again.'
      });
    }
  };
  
  return (
    <div className="user-profile-container">
      <h1>My Profile</h1>
      
      <div className="profile-content">
        <div className="profile-section">
          <h2>Profile Information</h2>
          
          {error && <ErrorMessage message={error} />}
          
          {isEditing ? (
            <form onSubmit={handleProfileUpdate}>
              {formErrors.general && <div className="error-container">{formErrors.general}</div>}
              
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control"
                />
                {formErrors.username && <div className="error-text">{formErrors.username}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
                {formErrors.email && <div className="error-text">{formErrors.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="preferredUnits">Preferred Units</label>
                <select
                  id="preferredUnits"
                  name="preferredUnits"
                  value={formData.preferredUnits}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="metric">Metric (km, m)</option>
                  <option value="imperial">Imperial (mi, ft)</option>
                </select>
              </div>
              
              <div className="form-actions">
                <Button 
                  type="submit" 
                  className="btn-primary" 
                  isLoading={loading}
                >
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{user.username}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Bio:</span>
                <span className="info-value">{user.bio || 'No bio provided'}</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Preferred Units:</span>
                <span className="info-value">
                  {user.preferredUnits === 'imperial' ? 'Imperial (mi, ft)' : 'Metric (km, m)'}
                </span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <Button 
                className="btn-primary mt-3" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>
        
        <div className="profile-section">
          <h2>Change Password</h2>
          
          {isChangingPassword ? (
            <form onSubmit={handlePasswordUpdate}>
              {passwordErrors.general && <div className="error-container">{passwordErrors.general}</div>}
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                />
                {passwordErrors.currentPassword && <div className="error-text">{passwordErrors.currentPassword}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                />
                {passwordErrors.newPassword && <div className="error-text">{passwordErrors.newPassword}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-control"
                />
                {passwordErrors.confirmPassword && <div className="error-text">{passwordErrors.confirmPassword}</div>}
              </div>
              
              <div className="form-actions">
                <Button 
                  type="submit" 
                  className="btn-primary" 
                  isLoading={loading}
                >
                  Update Password
                </Button>
                <Button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsChangingPassword(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button 
              className="btn-primary" 
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          )}
        </div>
        
        <div className="profile-section">
          <h2>Your Statistics</h2>
          
          {statsError && <ErrorMessage message={statsError} />}
          
          {statsLoading ? (
            <LoadingSpinner message="Loading statistics..." />
          ) : (
            userStats && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{userStats.totalRoutes}</div>
                  <div className="stat-label">Total Routes</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{(userStats.totalDistance / 1000).toFixed(2)}</div>
                  <div className="stat-label">
                    Total Distance ({user.preferredUnits === 'imperial' ? 'mi' : 'km'})
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{userStats.totalElevationGain}</div>
                  <div className="stat-label">
                    Total Elevation Gain ({user.preferredUnits === 'imperial' ? 'ft' : 'm'})
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">
                    {Math.floor(userStats.totalDuration / 3600)}h {Math.floor((userStats.totalDuration % 3600) / 60)}m
                  </div>
                  <div className="stat-label">Total Time</div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
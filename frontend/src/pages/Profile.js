// frontend/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import { updateProfile } from '../store/actions/authActions';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(state => state.auth);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [editing, setEditing] = useState(false);

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                username: user.username || '',
                email: user.email || '',
                fullName: user.full_name || '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [user]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Clear success message when editing
        if (success) {
            setSuccess(false);
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Password validation (only if password is being changed)
        if (formData.password) {
            if (formData.password.length < 6) {
                errors.password = 'Password must be at least 6 characters';
            }
            
            if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Only include fields that are needed for the update
            const updateData = {
                id: user.id,
                username: formData.username,
                email: formData.email,
                full_name: formData.fullName
            };
            
            // Only include password if it was changed
            if (formData.password) {
                updateData.password = formData.password;
            }
            
            dispatch(updateProfile(updateData));
            setSuccess(true);
            setEditing(false);
            
            // Clear password fields after update
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));
        }
    };

    // Toggle edit mode
    const toggleEdit = () => {
        setEditing(!editing);
        
        // Reset form errors when toggling edit mode
        setFormErrors({});
    };

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
                
                <Card className="mb-6" padding="large">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
                                <p className="text-gray-600">{user?.email}</p>
                            </div>
                        </div>
                        <div>
                            <Button
                                onClick={toggleEdit}
                                variant={editing ? "light" : "outline"}
                            >
                                {editing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Success message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                            Profile updated successfully!
                        </div>
                    )}
                    
                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <FormInput
                                id="username"
                                name="username"
                                label="Username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={!editing}
                                required
                            />
                            
                            <FormInput
                                id="email"
                                name="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={formErrors.email}
                                disabled={!editing}
                                required
                            />
                            
                            <FormInput
                                id="fullName"
                                name="fullName"
                                label="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={!editing}
                            />
                        </div>
                        
                        {editing && (
                            <>
                                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Change Password</h3>
                                <div className="grid gap-6 mb-6 md:grid-cols-2">
                                    <FormInput
                                        id="password"
                                        name="password"
                                        label="New Password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={formErrors.password}
                                        helper="Leave blank to keep current password"
                                    />
                                    
                                    <FormInput
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        label="Confirm New Password"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        error={formErrors.confirmPassword}
                                        disabled={!formData.password}
                                    />
                                </div>
                                
                                <div className="flex justify-end mt-6">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        loading={loading}
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                </Card>
                
                <Card className="mb-6" padding="large">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                                {user?.routes?.length || 0}
                            </div>
                            <div className="text-gray-500">Total Routes</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                                {user?.routes?.filter(r => r.is_public)?.length || 0}
                            </div>
                            <div className="text-gray-500">Public Routes</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-green-600 mb-1">
                                {/* Calculate total distance of all routes */}
                                {user?.routes?.reduce((sum, route) => sum + (route.distance || 0), 0).toFixed(1) || 0}
                            </div>
                            <div className="text-gray-500">Total Distance (km)</div>
                        </div>
                    </div>
                </Card>
                
                <Card padding="large">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                            <h3 className="text-gray-800 font-medium">Email Notifications</h3>
                            <p className="text-gray-500 text-sm">Receive notifications about route comments and likes</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-email" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                            <label htmlFor="toggle-email" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                        <div>
                            <h3 className="text-gray-800 font-medium">Profile Visibility</h3>
                            <p className="text-gray-500 text-sm">Make your profile visible to other users</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none">
                            <input type="checkbox" id="toggle-visibility" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                            <label htmlFor="toggle-visibility" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <h3 className="text-red-600 font-medium">Delete Account</h3>
                            <p className="text-gray-500 text-sm">Permanently delete your account and all data</p>
                        </div>
                        <Button
                            variant="danger"
                            size="small"
                            onClick={() => window.confirm('Are you sure you want to delete your account? This action cannot be undone.')}
                        >
                            Delete
                        </Button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
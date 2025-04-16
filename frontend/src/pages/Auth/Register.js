// frontend/src/pages/Auth/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../store/actions/authActions';

// Components
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [formErrors, setFormErrors] = useState({});

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        
        // Clear global auth error when user types
        if (error) {
            dispatch(clearAuthError());
        }
    };

    // Validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        // Username validation
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }
        
        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registerData } = formData;
            dispatch(register(registerData));
        }
    };

    // Redirect if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            
            <main className="flex-grow flex items-center justify-center py-12">
                <div className="w-full max-w-lg px-4">
                    <Card 
                        className="w-full"
                        shadow="lg"
                        padding="large"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
                            <p className="text-gray-600 mt-2">Join TERRA and start your journey</p>
                        </div>
                        
                        {/* Global error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    id="username"
                                    name="username"
                                    label="Username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    error={formErrors.username}
                                    icon={
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    }
                                    required
                                />
                                
                                <FormInput
                                    id="fullName"
                                    name="fullName"
                                    label="Full Name (Optional)"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    icon={
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    }
                                />
                            </div>
                            
                            <FormInput
                                id="email"
                                name="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                error={formErrors.email}
                                icon={
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                }
                                required
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    error={formErrors.password}
                                    helper="Must be at least 6 characters"
                                    icon={
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    }
                                    required
                                />
                                
                                <FormInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    error={formErrors.confirmPassword}
                                    icon={
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    }
                                    required
                                />
                            </div>
                            
                            <div className="mt-6 mb-6">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="text-gray-600">
                                            I agree to the{' '}
                                            <Link to="/terms" className="text-green-600 hover:text-green-500">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link to="/privacy" className="text-green-600 hover:text-green-500">
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="large"
                                loading={loading}
                            >
                                Create Account
                            </Button>
                            
                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </Card>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Register;
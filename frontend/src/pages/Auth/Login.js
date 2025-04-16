// frontend/src/pages/Auth/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../../store/actions/authActions';

// Components
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            dispatch(login(formData));
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
                <div className="w-full max-w-md px-4">
                    <Card 
                        className="w-full"
                        shadow="lg"
                        padding="large"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                            <p className="text-gray-600 mt-2">Sign in to your TERRA account</p>
                        </div>
                        
                        {/* Global error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <FormInput
                                id="username"
                                name="username"
                                label="Username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                error={formErrors.username}
                                icon={
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                                required
                            />
                            
                            <FormInput
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                error={formErrors.password}
                                icon={
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                                required
                            />
                            
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                            
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="large"
                                loading={loading}
                            >
                                Sign In
                            </Button>
                            
                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                                        Sign up
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

export default Login;
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';
import { parseApiError } from '../utils/errorHandler';

/**
 * Authentication context for managing user authentication state
 */
const AuthContext = createContext();

/**
 * Authentication provider component
 * 
 * @param {Object} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    /**
     * Load user data if a token exists
     */
    const loadUser = async () => {
        if (!apiService.auth.isAuthenticated()) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            // This assumes you have a /users/me endpoint
            const response = await apiService.users.getProfile();
            setUser(response.data);
            setError(null);
        } catch (err) {
            const errorInfo = parseApiError(err);
            
            // If auth error, clear tokens
            if (errorInfo.type === 'auth') {
                apiService.auth.logout();
            }
            
            setUser(null);
            setError(errorInfo);
        } finally {
            setIsLoading(false);
        }
    };
    
    /**
     * Login a user
     * 
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise} Login result
     */
    const login = async (username, password) => {
        try {
            setIsLoading(true);
            await apiService.auth.login(username, password);
            await loadUser();
            return { success: true };
        } catch (err) {
            const errorInfo = parseApiError(err);
            setError(errorInfo);
            return { success: false, error: errorInfo };
        } finally {
            setIsLoading(false);
        }
    };
    
    /**
     * Register a new user
     * 
     * @param {Object} userData - User registration data
     * @returns {Promise} Registration result
     */
    const register = async (userData) => {
        try {
            setIsLoading(true);
            await apiService.auth.register(userData);
            return { success: true };
        } catch (err) {
            const errorInfo = parseApiError(err);
            setError(errorInfo);
            return { success: false, error: errorInfo };
        } finally {
            setIsLoading(false);
        }
    };
    
    /**
     * Logout the current user
     */
    const logout = () => {
        apiService.auth.logout();
        setUser(null);
    };
    
    /**
     * Update the current user's profile
     * 
     * @param {Object} userData - Updated user data
     * @returns {Promise} Update result
     */
    const updateProfile = async (userData) => {
        try {
            setIsLoading(true);
            const response = await apiService.users.updateProfile(userData);
            setUser(response.data);
            return { success: true };
        } catch (err) {
            const errorInfo = parseApiError(err);
            setError(errorInfo);
            return { success: false, error: errorInfo };
        } finally {
            setIsLoading(false);
        }
    };
    
    /**
     * Change the current user's password
     * 
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise} Password change result
     */
    const changePassword = async (currentPassword, newPassword) => {
        try {
            setIsLoading(true);
            await apiService.users.changePassword(currentPassword, newPassword);
            return { success: true };
        } catch (err) {
            const errorInfo = parseApiError(err);
            setError(errorInfo);
            return { success: false, error: errorInfo };
        } finally {
            setIsLoading(false);
        }
    };
    
    // Load user on initial render
    useEffect(() => {
        loadUser();
        
        // Listen for logout events (e.g., from API service)
        const handleLogout = () => {
            setUser(null);
        };
        
        window.addEventListener('auth:logout', handleLogout);
        
        return () => {
            window.removeEventListener('auth:logout', handleLogout);
        };
    }, []);
    
    // Context value
    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser: loadUser
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to use the auth context
 * @returns {Object} Auth context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
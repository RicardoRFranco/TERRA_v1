// frontend/src/components/layout/DashboardLayout.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../store/actions/authActions';

const DashboardLayout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector(state => state.auth);
    
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Toggle sidebar for mobile
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    
    // Handle logout
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    
    // Check if the given path is active
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };
    
    // Navigation items
    const navItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: 'My Routes',
            path: '/routes',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            )
        },
        {
            name: 'Explore',
            path: '/explore',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            name: 'Create Route',
            path: '/create',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            name: 'Settings',
            path: '/settings',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div 
                className={`fixed inset-y-0 left-0 flex flex-col z-30 w-64 bg-green-800 text-white transition-transform duration-300 ease-in-out transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:static md:h-screen`}
            >
                {/* Sidebar header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-green-700">
                    <Link to="/" className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xl font-bold tracking-wider">TERRA</span>
                    </Link>
                    <button 
                        onClick={toggleSidebar}
                        className="md:hidden"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Sidebar content */}
                <div className="flex-grow overflow-y-auto">
                    <nav className="mt-5 px-2">
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                                        isActive(item.path)
                                            ? 'bg-green-700 text-white'
                                            : 'text-green-100 hover:bg-green-700 hover:text-white'
                                    }`}
                                >
                                    <div className="mr-3 text-green-300 group-hover:text-white">
                                        {item.icon}
                                    </div>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>

                {/* Sidebar footer - user info */}
                <div className="p-4 border-t border-green-700">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-medium text-lg">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">{user?.username || 'User'}</p>
                            <button 
                                onClick={handleLogout}
                                className="text-xs text-green-300 hover:text-white mt-1"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="h-16 flex items-center justify-between px-4 md:px-6">
                        {/* Mobile menu button */}
                        <button 
                            onClick={toggleSidebar}
                            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page title - can be dynamic based on current route */}
                        <h1 className="text-xl font-semibold text-gray-800 md:ml-0">
                            {navItems.find(item => isActive(item.path))?.name || 'Dashboard'}
                        </h1>

                        {/* Right side actions/profile */}
                        <div className="flex items-center">
                            {/* Notifications */}
                            <button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            {/* Help */}
                            <button className="p-1 ml-3 text-gray-400 hover:text-gray-500 focus:outline-none">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            {/* Mobile profile menu */}
                            <div className="ml-3 md:hidden">
                                <Link to="/profile" className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

DashboardLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default DashboardLayout;
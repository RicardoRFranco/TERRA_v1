// frontend/src/components/layout/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Get authentication state from Redux store
    const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
    const userData = useSelector(state => state.auth?.user);

    return (
        <header className="bg-green-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-green-400 group-hover:text-white transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-2xl font-bold tracking-wider">TERRA</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex space-x-8">
                            <li><Link to="/" className="font-medium hover:text-green-300 transition-colors duration-300">Home</Link></li>
                            {isAuthenticated && (
                                <>
                                    <li><Link to="/routes" className="font-medium hover:text-green-300 transition-colors duration-300">My Routes</Link></li>
                                    <li><Link to="/explore" className="font-medium hover:text-green-300 transition-colors duration-300">Explore</Link></li>
                                    <li><Link to="/create" className="font-medium hover:text-green-300 transition-colors duration-300">Create Route</Link></li>
                                </>
                            )}
                            <li><Link to="/about" className="font-medium hover:text-green-300 transition-colors duration-300">About</Link></li>
                        </ul>
                    </nav>

                    {/* Auth Buttons or User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-green-200 hover:text-white transition-colors duration-300">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-medium transition-colors duration-300">
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                                        {userData?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span>{userData?.username || 'User'}</span>
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Profile</Link>
                                    <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Settings</Link>
                                    <button className="w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100">Sign Out</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMenuOpen 
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 border-t border-green-700 pt-4">
                        <ul className="flex flex-col space-y-4">
                            <li><Link to="/" className="block hover:text-green-300 transition-colors duration-300 font-medium">Home</Link></li>
                            <li><Link to="/about" className="block hover:text-green-300 transition-colors duration-300 font-medium">About</Link></li>
                            
                            {isAuthenticated ? (
                                <>
                                    <li><Link to="/routes" className="block hover:text-green-300 transition-colors duration-300 font-medium">My Routes</Link></li>
                                    <li><Link to="/explore" className="block hover:text-green-300 transition-colors duration-300 font-medium">Explore</Link></li>
                                    <li><Link to="/create" className="block hover:text-green-300 transition-colors duration-300 font-medium">Create Route</Link></li>
                                    <li><Link to="/profile" className="block hover:text-green-300 transition-colors duration-300 font-medium">Profile</Link></li>
                                    <li><Link to="/settings" className="block hover:text-green-300 transition-colors duration-300 font-medium">Settings</Link></li>
                                    <li><button className="block hover:text-green-300 transition-colors duration-300 font-medium">Sign Out</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login" className="block hover:text-green-300 transition-colors duration-300 font-medium">Sign In</Link></li>
                                    <li><Link to="/register" className="block bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-center transition-colors duration-300 font-medium">Sign Up</Link></li>
                                </>
                            )}
                        </ul>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
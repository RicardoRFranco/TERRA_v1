// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';

const Home = () => {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-800 to-green-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                Discover and Share Amazing Routes with TERRA
                            </h1>
                            <p className="text-xl mb-8 text-green-100">
                                Plan your adventures, track your journeys, and connect with fellow explorers. Your next great expedition starts here.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                {isAuthenticated ? (
                                    <>
                                        <Button 
                                            to="/routes" 
                                            variant="light" 
                                            size="large"
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            }
                                            iconPosition="right"
                                        >
                                            My Routes
                                        </Button>
                                        <Button 
                                            to="/create" 
                                            variant="outline" 
                                            size="large"
                                            className="text-white border-white hover:bg-white hover:text-green-600"
                                        >
                                            Create New Route
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button 
                                            to="/register" 
                                            variant="light" 
                                            size="large"
                                        >
                                            Get Started
                                        </Button>
                                        <Button 
                                            to="/login" 
                                            variant="outline" 
                                            size="large"
                                            className="text-white border-white hover:bg-white hover:text-green-600"
                                        >
                                            Sign In
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <div className="relative rounded-lg overflow-hidden shadow-xl">
                                <svg className="w-full h-auto" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="600" height="400" fill="#f8fafc" />
                                    <path d="M0,250 Q150,150 300,250 T600,250" fill="none" stroke="#16a34a" strokeWidth="8" />
                                    <circle cx="150" cy="200" r="20" fill="#16a34a" />
                                    <circle cx="450" cy="200" r="20" fill="#16a34a" />
                                    <path d="M150,200 L450,200" fill="none" stroke="#16a34a" strokeWidth="5" strokeDasharray="10 5" />
                                </svg>
                                <div className="absolute inset-0 bg-gradient-to-t from-green-800 to-transparent opacity-30"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Features that Make TERRA Special</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                            Our platform is designed to make route planning and sharing as seamless as possible.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-gray-50 rounded-lg p-6 shadow-md transition-transform duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Maps</h3>
                            <p className="text-gray-600">
                                Create and view routes with our easy-to-use interactive mapping tools.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-50 rounded-lg p-6 shadow-md transition-transform duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Sharing</h3>
                            <p className="text-gray-600">
                                Share your favorite routes with friends and discover routes created by others.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-50 rounded-lg p-6 shadow-md transition-transform duration-300 hover:transform hover:scale-105">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">GPX Import</h3>
                            <p className="text-gray-600">
                                Import your existing routes from GPS devices or other apps using GPX files.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-green-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                        Join thousands of explorers who are already using TERRA to discover new paths and share their adventures.
                    </p>
                    <Button 
                        to={isAuthenticated ? "/create" : "/register"} 
                        variant="primary" 
                        size="large"
                        className="px-8"
                    >
                        {isAuthenticated ? "Create Your First Route" : "Sign Up Now"}
                    </Button>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default Home;
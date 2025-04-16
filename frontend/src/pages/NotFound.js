// frontend/src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-red-100 p-4">
          <div className="rounded-full bg-red-200 p-4">
            <svg className="h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="mt-5 text-4xl font-bold text-gray-900 tracking-tight">
          404 - Page Not Found
        </h1>
        
        <p className="mt-3 text-lg text-gray-600 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="mt-10 flex justify-center space-x-4">
          <Button
            variant="primary"
            size="large"
            to="/"
            icon={
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Go Home
          </Button>
          
          <Button
            variant="outline"
            size="large"
            as="a"
            href="mailto:support@terraapp.com"
            icon={
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            Contact Support
          </Button>
        </div>
        
        <div className="mt-16">
          <p className="text-base text-gray-500">
            Looking for something else?
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <Link to="/routes" className="hover:text-green-600 transition-colors duration-300 text-gray-700">
              Browse Routes
            </Link>
            <Link to="/explore" className="hover:text-green-600 transition-colors duration-300 text-gray-700">
              Explore Map
            </Link>
            <Link to="/create" className="hover:text-green-600 transition-colors duration-300 text-gray-700">
              Create Route
            </Link>
          </div>
        </div>
      </div>
      
      {/* Back to home link at top-left */}
      <div className="absolute top-4 left-4">
        <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors duration-300">
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to TERRA
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
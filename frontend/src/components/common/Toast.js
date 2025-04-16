// frontend/src/components/common/Toast.js
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Toast = ({ message, type = 'info', duration = 5000, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);
    const [intervalId, setIntervalId] = useState(null);

    // Define toast type styles
    const toastTypes = {
        success: {
            background: 'bg-green-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )
        },
        error: {
            background: 'bg-red-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )
        },
        warning: {
            background: 'bg-yellow-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            )
        },
        info: {
            background: 'bg-blue-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            )
        }
    };

    // Get toast style based on type
    const toastStyle = toastTypes[type] || toastTypes.info;
    
    // Handle close animation
    const dismissToast = () => {
        setIsVisible(false);
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        // Wait for animation to finish before removing from DOM
        setTimeout(() => {
            if (onDismiss) {
                onDismiss();
            }
        }, 300);
    };

    // Start progress countdown when component mounts
    useEffect(() => {
        if (duration) {
            // Set progress bar to decrease over time
            const stepTime = 10; // Update every 10ms
            const stepValue = (stepTime / duration) * 100;
            
            const id = setInterval(() => {
                setProgress(prevProgress => {
                    const newProgress = prevProgress - stepValue;
                    if (newProgress <= 0) {
                        clearInterval(id);
                        dismissToast();
                        return 0;
                    }
                    return newProgress;
                });
            }, stepTime);
            
            setIntervalId(id);
            
            // Clean up interval on unmount
            return () => {
                clearInterval(id);
            };
        }
    }, [duration]);

    return (
        <div 
            className={`max-w-md w-full ${toastStyle.background} text-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}
            role="alert"
        >
            <div className="p-4 flex items-start">
                <div className="flex-shrink-0">
                    {toastStyle.icon}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        className="inline-flex text-white focus:outline-none focus:text-gray-300 hover:text-gray-200"
                        onClick={dismissToast}
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Progress bar */}
            <div 
                className="h-1 bg-white bg-opacity-40"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

Toast.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    duration: PropTypes.number,
    onDismiss: PropTypes.func
};

export default Toast;
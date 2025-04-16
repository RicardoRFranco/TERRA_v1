// frontend/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile';
import RoutesList from './pages/Routes/RoutesList';
import RouteDetails from './pages/Routes/RouteDetails';
import CreateRoute from './pages/Routes/CreateRoute';
import Explore from './pages/Routes/Explore';
import About from './pages/About';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Components
import LoadingOverlay from './components/common/LoadingOverlay';
import Toast from './components/common/Toast';

// Actions
import { checkAuth } from './store/actions/authActions';

// Styles - Tailwind CSS + custom styles
import './assets/styles/main.css';

// Main App component with Redux
const AppContent = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading, user } = useSelector(state => state.auth);
    const { toasts } = useSelector(state => state.ui);

    useEffect(() => {
        // Check authentication status on app load
        dispatch(checkAuth());
    }, [dispatch]);

    // Protected route wrapper
    const ProtectedRoute = ({ children }) => {
        if (loading) return <LoadingOverlay />;
        if (!isAuthenticated) return <Navigate to="/login" replace />;
        return children;
    };

    if (loading && !user) {
        return <LoadingOverlay fullScreen />;
    }

    return (
        <>
            {/* Toast notifications */}
            <div className="fixed top-4 right-4 z-50">
                {toasts.map(toast => (
                    <Toast 
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onDismiss={() => dispatch({ type: 'REMOVE_TOAST', payload: toast.id })}
                    />
                ))}
            </div>
            
            <Router>
                <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
                        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
                        
                        {/* Protected routes */}
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                        <Route path="/routes" element={<ProtectedRoute><RoutesList /></ProtectedRoute>} />
                        <Route path="/routes/:id" element={<ProtectedRoute><RouteDetails /></ProtectedRoute>} />
                        <Route path="/create" element={<ProtectedRoute><CreateRoute /></ProtectedRoute>} />
                        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                        
                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
};

// Root App component with Redux Provider
function App() {

    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

export default App;
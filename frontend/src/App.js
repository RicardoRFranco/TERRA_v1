import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from './contexts/AuthContext';
import './assets/styles/main.css';

// Layout Components
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy-loaded Pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const RoutesList = lazy(() => import('./pages/RoutesList'));
const RouteDetail = lazy(() => import('./pages/RouteDetail'));
const CreateRoute = lazy(() => import('./pages/CreateRoute'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Route Guard Component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('terra_auth_token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <AuthProvider>
                    <Router>
                        <Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                
                                {/* Protected Routes */}
                                <Route 
                                    path="/profile" 
                                    element={
                                        <PrivateRoute>
                                            <Profile />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/routes" 
                                    element={
                                        <PrivateRoute>
                                            <RoutesList />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/routes/:id" 
                                    element={
                                        <PrivateRoute>
                                            <RouteDetail />
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/routes/new" 
                                    element={
                                        <PrivateRoute>
                                            <CreateRoute />
                                        </PrivateRoute>
                                    } 
                                />
                                
                                {/* Catch-all Route */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </Router>
                </AuthProvider>
            </Provider>
        </ErrorBoundary>
    );
}

export default App;
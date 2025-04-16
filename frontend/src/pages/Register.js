import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="register-page">
      <div className="page-header">
        <h1>Create an Account</h1>
      </div>
      
      <div className="auth-container">
        <RegisterForm />
        
        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
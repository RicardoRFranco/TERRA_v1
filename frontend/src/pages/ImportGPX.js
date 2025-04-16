import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ImportGPXComponent from '../components/routes/ImportGPX';

const ImportGPX = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="import-gpx-page">
      <div className="page-header">
        <h1>Import GPX File</h1>
        <p>Upload a GPX file to create a new route</p>
      </div>
      
      <ImportGPXComponent />
    </div>
  );
};

export default ImportGPX;
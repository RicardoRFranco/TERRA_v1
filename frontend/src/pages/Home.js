import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Route Tracker</h1>
          <p className="hero-subtitle">
            Create, share, and track your favorite running, hiking, and cycling routes
          </p>
          
          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/routes" className="btn btn-primary">
                  My Routes
                </Link>
                <Link to="/routes/create" className="btn btn-secondary">
                  Create New Route
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="hero-image">
          <img src="/images/hero-map.jpg" alt="Map route" />
        </div>
      </section>
      
      <section className="features-section">
        <h2>Features</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            <h3>Create Routes</h3>
            <p>
              Easily create custom routes by clicking on the map or importing GPX files from your 
              favorite devices.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>Track Statistics</h3>
            <p>
              Analyze elevation profiles, distance, estimated duration, and other key metrics for 
              your routes.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-share-alt"></i>
            </div>
            <h3>Share Routes</h3>
            <p>
              Share your favorite routes with friends and the community. Discover new paths created 
              by others.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>Mobile Friendly</h3>
            <p>
              Access your routes on the go with our responsive design that works on all your devices.
            </p>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Tracking?</h2>
          <p>
            Join thousands of runners, hikers, and cyclists who use Route Tracker to plan and 
            share their adventures.
          </p>
          
          {isAuthenticated ? (
            <Link to="/routes/create" className="btn btn-primary">
              Create Your First Route
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary">
              Create Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
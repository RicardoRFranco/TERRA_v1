import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/actions';

const Navbar = ({ isAuthenticated, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Route Tracker</Link>
      </div>

      {/* Mobile menu toggle */}
      <button className="navbar-toggler" onClick={toggleMenu}>
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/explore" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Explore
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/routes" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  My Routes
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/import-gpx" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Import GPX
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle" 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {user?.username || 'User'}
                </button>
                <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
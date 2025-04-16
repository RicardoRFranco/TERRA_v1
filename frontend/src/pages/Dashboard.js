import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserStats, getRoutes } from '../store/actions';
import { LoadingSpinner, ErrorMessage } from '../components/error/ErrorAndLoading';
import RouteCard from '../components/routes/RouteCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { userStats, statsLoading, statsError } = useSelector(state => state.user);
  const { routes, loading: routesLoading, error: routesError } = useSelector(state => state.routes);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Load user stats and recent routes
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserStats());
      dispatch(getRoutes(true)); // Get user's routes
    }
  }, [dispatch, isAuthenticated]);
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  // Get recent routes (last 3)
  const recentRoutes = routes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  
  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.username || 'User'}!</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Activity Summary</h2>
          </div>
          
          {statsLoading ? (
            <LoadingSpinner />
          ) : statsError ? (
            <ErrorMessage message={statsError} />
          ) : userStats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{userStats.totalRoutes}</div>
                <div className="stat-label">Total Routes</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{(userStats.totalDistance / 1000).toFixed(2)}</div>
                <div className="stat-label">
                  Total Distance ({user?.preferredUnits === 'imperial' ? 'mi' : 'km'})
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{userStats.totalElevationGain}</div>
                <div className="stat-label">
                  Total Elevation Gain ({user?.preferredUnits === 'imperial' ? 'ft' : 'm'})
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">
                  {Math.floor(userStats.totalDuration / 3600)}h {Math.floor((userStats.totalDuration % 3600) / 60)}m
                </div>
                <div className="stat-label">Total Time</div>
              </div>
            </div>
          ) : (
            <p>No stats available yet. Create some routes to see your statistics.</p>
          )}
        </div>
        
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Routes</h2>
            <Link to="/routes" className="btn btn-sm btn-outline-primary">
              View All
            </Link>
          </div>
          
          {routesLoading ? (
            <LoadingSpinner />
          ) : routesError ? (
            <ErrorMessage message={routesError} />
          ) : recentRoutes.length > 0 ? (
            <div className="recent-routes-grid">
              {recentRoutes.map(route => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't created any routes yet.</p>
              <Link to="/routes/create" className="btn btn-primary">
                Create Your First Route
              </Link>
            </div>
          )}
        </div>
        
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          
          <div className="quick-actions-grid">
            <Link to="/routes/create" className="quick-action-card">
              <div className="action-icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <div className="action-title">Create Route</div>
              <div className="action-description">Draw a new route on the map</div>
            </Link>
            
            <Link to="/import-gpx" className="quick-action-card">
              <div className="action-icon">
                <i className="fas fa-file-import"></i>
              </div>
              <div className="action-title">Import GPX</div>
              <div className="action-description">Import a route from a GPX file</div>
            </Link>
            
            <Link to="/explore" className="quick-action-card">
              <div className="action-icon">
                <i className="fas fa-compass"></i>
              </div>
              <div className="action-title">Explore</div>
              <div className="action-description">Discover routes from the community</div>
            </Link>
            
            <Link to="/profile" className="quick-action-card">
              <div className="action-icon">
                <i className="fas fa-user-cog"></i>
              </div>
              <div className="action-title">Profile</div>
              <div className="action-description">Update your profile settings</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
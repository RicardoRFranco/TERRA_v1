import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import RouteCard from './RouteCard';
import { LoadingSpinner, ErrorMessage } from '../error/ErrorAndLoading';
import { getRoutes, deleteRoute } from '../../store/actions';
import Button from '../common/Button';

const RouteList = ({ userRoutesOnly = false }) => {
  const dispatch = useDispatch();
  const { routes, loading, error } = useSelector(state => state.routes);
  const { user } = useSelector(state => state.auth);
  
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Load routes on component mount
  useEffect(() => {
    dispatch(getRoutes(userRoutesOnly));
  }, [dispatch, userRoutesOnly]);
  
  // Handle delete route
  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await dispatch(deleteRoute(routeId));
        dispatch(getRoutes(userRoutesOnly)); // Refresh the list
      } catch (error) {
        console.error('Failed to delete route:', error);
      }
    }
  };
  
  // Filter and sort routes
  const filteredAndSortedRoutes = () => {
    let result = [...routes];
    
    // Filter by user if userRoutesOnly is true
    if (userRoutesOnly && user) {
      result = result.filter(route => route.userId === user.id);
    }
    
    // Apply search filter
    if (filter) {
      const lowercaseFilter = filter.toLowerCase();
      result = result.filter(
        route => 
          route.name.toLowerCase().includes(lowercaseFilter) ||
          (route.description && route.description.toLowerCase().includes(lowercaseFilter)) ||
          (route.tags && route.tags.some(tag => tag.toLowerCase().includes(lowercaseFilter)))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'distance_asc':
        return result.sort((a, b) => a.distance - b.distance);
      case 'distance_desc':
        return result.sort((a, b) => b.distance - a.distance);
      case 'duration_asc':
        return result.sort((a, b) => a.duration - b.duration);
      case 'duration_desc':
        return result.sort((a, b) => b.duration - a.duration);
      default:
        return result;
    }
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading routes..." />;
  }
  
  if (error) {
    return <ErrorMessage message={`Error loading routes: ${error}`} />;
  }
  
  const displayedRoutes = filteredAndSortedRoutes();
  
  return (
    <div className="routes-list-container">
      <div className="routes-header">
        <h1>{userRoutesOnly ? 'My Routes' : 'Explore Routes'}</h1>
        
        {userRoutesOnly && (
          <Link to="/routes/create" className="btn btn-primary">
            Create New Route
          </Link>
        )}
      </div>
      
      <div className="filters-container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search routes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="sort-filter">
          <label htmlFor="sortBy">Sort by: </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="distance_asc">Distance (Low to High)</option>
            <option value="distance_desc">Distance (High to Low)</option>
            <option value="duration_asc">Duration (Short to Long)</option>
            <option value="duration_desc">Duration (Long to Short)</option>
          </select>
        </div>
      </div>
      
      {displayedRoutes.length === 0 ? (
        <div className="no-routes-message">
          <p>No routes found.</p>
          {userRoutesOnly && (
            <Link to="/routes/create" className="btn btn-primary mt-3">
              Create your first route
            </Link>
          )}
        </div>
      ) : (
        <div className="route-cards-grid">
          {displayedRoutes.map(route => (
            <RouteCard
              key={route.id}
              route={route}
              onDelete={userRoutesOnly ? handleDeleteRoute : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteList;
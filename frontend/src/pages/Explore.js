import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRoutes } from '../store/actions';
import RouteList from '../components/routes/RouteList';
import { LoadingSpinner, ErrorMessage } from '../components/error/ErrorAndLoading';

const Explore = () => {
  const dispatch = useDispatch();
  const { routes, loading, error } = useSelector(state => state.routes);
  
  const [filter, setFilter] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [minDistance, setMinDistance] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  
  // Load routes on component mount
  useEffect(() => {
    dispatch(getRoutes(false)); // Get all public routes
  }, [dispatch]);
  
  // Filter routes based on criteria
  const filteredRoutes = () => {
    if (!routes) return [];
    
    return routes.filter(route => {
      // Filter by search term
      const searchMatch = !filter || 
        route.name.toLowerCase().includes(filter.toLowerCase()) ||
        (route.description && route.description.toLowerCase().includes(filter.toLowerCase())) ||
        (route.tags && route.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())));
      
      // Filter by difficulty
      const difficultyMatch = difficulty === 'all' || route.difficulty === difficulty;
      
      // Filter by distance (convert from meters to km)
      const distanceInKm = route.distance / 1000;
      const minDistanceMatch = !minDistance || distanceInKm >= parseFloat(minDistance);
      const maxDistanceMatch = !maxDistance || distanceInKm <= parseFloat(maxDistance);
      
      return searchMatch && difficultyMatch && minDistanceMatch && maxDistanceMatch;
    });
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setFilter('');
    setDifficulty('all');
    setMinDistance('');
    setMaxDistance('');
  };
  
  return (
    <div className="explore-container">
      <div className="page-header">
        <h1>Explore Routes</h1>
        <p>Discover routes shared by the community</p>
      </div>
      
      <div className="filters-section">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search routes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="advanced-filters">
          <div className="filter-group">
            <label htmlFor="difficulty">Difficulty:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="form-select"
            >
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="minDistance">Min Distance (km):</label>
            <input
              type="number"
              id="minDistance"
              value={minDistance}
              onChange={(e) => setMinDistance(e.target.value)}
              className="form-control"
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="maxDistance">Max Distance (km):</label>
            <input
              type="number"
              id="maxDistance"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="form-control"
              min="0"
              step="0.1"
            />
          </div>
          
          <button
            className="btn btn-secondary"
            onClick={handleResetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {loading ? (
        <LoadingSpinner message="Loading routes..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="routes-content">
          <div className="results-info">
            <p>Showing {filteredRoutes().length} of {routes.length} routes</p>
          </div>
          
          {filteredRoutes().length === 0 ? (
            <div className="no-results">
              <p>No routes found matching your criteria.</p>
              <button
                className="btn btn-primary"
                onClick={handleResetFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <RouteList routes={filteredRoutes()} userRoutesOnly={false} />
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;
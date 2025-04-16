import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Map from '../map/Map';
import { LoadingSpinner, ErrorMessage } from '../error/ErrorAndLoading';
import { getRouteById, deleteRoute } from '../../store/actions';
import Button from '../common/Button';

const RouteDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentRoute, loading, error } = useSelector(state => state.routes);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  // Fetch route details on component mount
  useEffect(() => {
    if (id) {
      dispatch(getRouteById(id));
    }
  }, [dispatch, id]);
  
  // Calculate if the current user is the owner of this route
  const isOwner = isAuthenticated && currentRoute && user && currentRoute.userId === user.id;
  
  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };
  
  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteRoute(id));
      navigate('/routes');
    } catch (error) {
      console.error('Failed to delete route:', error);
    }
  };
  
  // Format duration (from seconds to HH:MM:SS)
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading route details..." />;
  }
  
  if (error) {
    return <ErrorMessage message={`Error loading route: ${error}`} />;
  }
  
  if (!currentRoute) {
    return <ErrorMessage message="Route not found" />;
  }
  
  return (
    <div className="route-detail-container">
      <header className="route-detail-header">
        <h1>{currentRoute.name}</h1>
        <p className="route-description">{currentRoute.description}</p>
      </header>
      
      <div className="route-stats-container">
        <div className="route-stats">
          <div className="stat-item">
            <div className="stat-value">{(currentRoute.distance / 1000).toFixed(2)}</div>
            <div className="stat-label">Distance (km)</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{currentRoute.elevationGain}</div>
            <div className="stat-label">Elevation Gain (m)</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{formatDuration(currentRoute.duration)}</div>
            <div className="stat-label">Duration</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">
              {new Date(currentRoute.createdAt).toLocaleDateString()}
            </div>
            <div className="stat-label">Created</div>
          </div>
        </div>
      </div>
      
      <div className="map-section">
        <Map 
          points={currentRoute.points} 
          height="500px"
          drawRoute={true}
          showMarkers={true}
        />
      </div>
      
      {isOwner && (
        <div className="route-actions mt-3">
          {!isConfirmingDelete ? (
            <>
              <Button 
                className="btn-primary me-2"
                onClick={() => navigate(`/routes/edit/${id}`)}
              >
                Edit Route
              </Button>
              <Button 
                className="btn-danger"
                onClick={handleDeleteClick}
              >
                Delete Route
              </Button>
            </>
          ) : (
            <div className="delete-confirmation">
              <p className="text-danger">Are you sure you want to delete this route?</p>
              <Button 
                className="btn-danger me-2"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </Button>
              <Button 
                className="btn-secondary"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div className="route-metadata mt-3">
        <h3>Additional Information</h3>
        <table className="route-metadata-table">
          <tbody>
            {currentRoute.startPoint && (
              <tr>
                <th>Start Point</th>
                <td>{currentRoute.startPoint}</td>
              </tr>
            )}
            {currentRoute.endPoint && (
              <tr>
                <th>End Point</th>
                <td>{currentRoute.endPoint}</td>
              </tr>
            )}
            {currentRoute.difficulty && (
              <tr>
                <th>Difficulty</th>
                <td>{currentRoute.difficulty}</td>
              </tr>
            )}
            {currentRoute.tags && currentRoute.tags.length > 0 && (
              <tr>
                <th>Tags</th>
                <td>
                  {currentRoute.tags.map(tag => (
                    <span key={tag} className="route-tag">{tag}</span>
                  ))}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteDetail;
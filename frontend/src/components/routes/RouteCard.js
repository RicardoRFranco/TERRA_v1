import React from 'react';
import { Link } from 'react-router-dom';

const RouteCard = ({ route, onDelete }) => {
  const {
    id,
    name,
    description,
    distance,
    elevationGain,
    createdAt,
    duration,
    thumbnail
  } = route;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString();
  
  // Format distance (from meters to km)
  const formattedDistance = (distance / 1000).toFixed(2);
  
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

  return (
    <div className="card route-card">
      {thumbnail && (
        <div className="card-img-top">
          <img src={thumbnail} alt={name} />
        </div>
      )}
      
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        
        <div className="route-stats">
          <div className="stat-item">
            <div className="stat-value">{formattedDistance}</div>
            <div className="stat-label">km</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{elevationGain}</div>
            <div className="stat-label">m gain</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{formatDuration(duration)}</div>
            <div className="stat-label">duration</div>
          </div>
        </div>
        
        <p className="card-text mt-3">
          <small className="text-muted">Created on {formattedDate}</small>
        </p>
      </div>
      
      <div className="card-footer">
        <Link to={`/routes/${id}`} className="btn btn-primary">
          View Details
        </Link>
        
        {onDelete && (
          <button 
            onClick={() => onDelete(id)} 
            className="btn btn-danger ms-2"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default RouteCard;
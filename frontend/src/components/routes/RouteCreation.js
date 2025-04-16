import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Map from '../map/Map';
import Button from '../common/Button';
import { createRoute } from '../../store/actions';

const RouteCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.routes);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'moderate',
    points: [],
    tags: []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error if field is being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle map click to add points
  const handleMapClick = (latlng) => {
    setFormData({
      ...formData,
      points: [...formData.points, [latlng.lat, latlng.lng]]
    });
  };
  
  // Handle marker drag to update points
  const handleMarkerDrag = (index, newPosition) => {
    const updatedPoints = [...formData.points];
    updatedPoints[index] = newPosition;
    
    setFormData({
      ...formData,
      points: updatedPoints
    });
  };
  
  // Handle removing a point
  const handleRemovePoint = (index) => {
    const updatedPoints = [...formData.points];
    updatedPoints.splice(index, 1);
    
    setFormData({
      ...formData,
      points: updatedPoints
    });
  };
  
  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };
  
  // Calculate route metrics
  const calculateRouteMetrics = () => {
    const { points } = formData;
    
    if (points.length < 2) {
      return {
        distance: 0,
        elevationGain: 0,
        duration: 0
      };
    }
    
    // Calculate distance (simplified, in meters)
    let distance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      distance += calculateDistance(p1, p2);
    }
    
    // Mock elevation gain and duration (in real app would use elevation data)
    const elevationGain = Math.round(distance * 0.05); // Simplified calculation
    const duration = Math.round(distance / 1.4); // Assuming 1.4 m/s average speed
    
    return {
      distance,
      elevationGain,
      duration
    };
  };
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (p1, p2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = p1[0] * Math.PI / 180;
    const φ2 = p2[0] * Math.PI / 180;
    const Δφ = (p2[0] - p1[0]) * Math.PI / 180;
    const Δλ = (p2[1] - p1[1]) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // Distance in meters
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Route name is required';
    }
    
    if (formData.points.length < 2) {
      errors.points = 'Route must have at least 2 points';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Calculate route metrics
    const metrics = calculateRouteMetrics();
    
    // Combine form data with metrics
    const routeData = {
      ...formData,
      ...metrics
    };
    
    try {
      await dispatch(createRoute(routeData));
      navigate('/routes');
    } catch (err) {
      console.error('Failed to create route:', err);
      setFormErrors({
        ...formErrors,
        general: err.message || 'Failed to create route. Please try again.'
      });
    }
  };
  
  const { distance, elevationGain, duration } = calculateRouteMetrics();
  
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
    <div className="route-creation-container">
      <h1>Create New Route</h1>
      
      {formErrors.general && (
        <div className="error-container">{formErrors.general}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Route Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter route name"
            />
            {formErrors.name && <div className="error-text">{formErrors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="form-control"
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Describe your route"
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>Tags</label>
          <div className="tags-input-container">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="form-control"
              placeholder="Add tags (press Enter)"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          
          <div className="tags-container">
            {formData.tags.map(tag => (
              <span key={tag} className="tag-item">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="tag-remove-btn"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
        
        <div className="map-container-section">
          <label>Route Map</label>
          <p className="map-instructions">Click on the map to add points. Drag markers to adjust positions.</p>
          
          {formErrors.points && <div className="error-text">{formErrors.points}</div>}
          
          <Map
            points={formData.points}
            height="500px"
            drawRoute={true}
            showMarkers={true}
            editable={true}
            onMapClick={handleMapClick}
            onMarkerDrag={handleMarkerDrag}
          />
        </div>
        
        <div className="points-list">
          <h3>Route Points ({formData.points.length})</h3>
          {formData.points.length === 0 ? (
            <p>No points added yet. Click on the map to add points.</p>
          ) : (
            <ul className="points-list-items">
              {formData.points.map((point, index) => (
                <li key={index} className="point-item">
                  <span>Point {index + 1}: {point[0].toFixed(6)}, {point[1].toFixed(6)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePoint(index)}
                    className="btn btn-sm btn-danger"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="route-metrics">
          <h3>Route Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">Distance:</span>
              <span className="metric-value">{(distance / 1000).toFixed(2)} km</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Elevation Gain:</span>
              <span className="metric-value">{elevationGain} m</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Estimated Duration:</span>
              <span className="metric-value">{formatDuration(duration)}</span>
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <Button
            type="submit"
            className="btn-primary"
            isLoading={loading}
            disabled={formData.points.length < 2}
          >
            Create Route
          </Button>
          <Button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/routes')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RouteCreation;
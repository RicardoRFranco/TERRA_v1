import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Map from '../map/Map';
import Button from '../common/Button';
import { importGPX } from '../../store/actions';
import { ErrorMessage } from '../error/ErrorAndLoading';

const ImportGPX = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const { loading, error } = useSelector(state => state.routes);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'moderate',
    tags: []
  });
  
  const [gpxData, setGpxData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [parseError, setParseError] = useState(null);
  
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
  
  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    if (file.name.toLowerCase().endsWith('.gpx')) {
      try {
        const fileContent = await readFileAsText(file);
        const parsedData = parseGPXData(fileContent);
        
        if (parsedData) {
          setGpxData(parsedData);
          setParseError(null);
          
          // Extract name from file if available
          if (parsedData.name && !formData.name) {
            setFormData({
              ...formData,
              name: parsedData.name
            });
          }
        } else {
          setParseError('Failed to parse GPX file. Please check the file format.');
        }
      } catch (error) {
        console.error('Error reading GPX file:', error);
        setParseError(`Error reading file: ${error.message}`);
      }
    } else {
      setParseError('Please select a valid GPX file (.gpx extension)');
    }
  };
  
  // Read file as text
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };
  
  // Parse GPX data
  const parseGPXData = (gpxContent) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        console.error('XML parsing error:', parserError.textContent);
        return null;
      }
      
      // Extract route name if available
      let name = '';
      const nameEl = xmlDoc.querySelector('gpx trk name');
      if (nameEl) {
        name = nameEl.textContent;
      }
      
      // Extract track points
      const trkptNodes = xmlDoc.querySelectorAll('trkpt');
      if (trkptNodes.length === 0) {
        console.error('No track points found in GPX file');
        return null;
      }
      
      const points = Array.from(trkptNodes).map(trkpt => {
        const lat = parseFloat(trkpt.getAttribute('lat'));
        const lon = parseFloat(trkpt.getAttribute('lon'));
        
        let elevation = 0;
        const eleEl = trkpt.querySelector('ele');
        if (eleEl) {
          elevation = parseFloat(eleEl.textContent);
        }
        
        return { lat, lon, elevation };
      });
      
      // Convert to simpler format for map display
      const mapPoints = points.map(p => [p.lat, p.lon]);
      
      // Calculate metrics
      const distance = calculateTotalDistance(points);
      const elevationGain = calculateElevationGain(points);
      const duration = estimateDuration(distance);
      
      return {
        name,
        points: mapPoints,
        fullPoints: points,
        metrics: {
          distance,
          elevationGain,
          duration
        }
      };
    } catch (error) {
      console.error('Error parsing GPX data:', error);
      return null;
    }
  };
  
  // Calculate total distance using Haversine formula
  const calculateTotalDistance = (points) => {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      const R = 6371e3; // Earth's radius in meters
      const φ1 = p1.lat * Math.PI / 180;
      const φ2 = p2.lat * Math.PI / 180;
      const Δφ = (p2.lat - p1.lat) * Math.PI / 180;
      const Δλ = (p2.lon - p1.lon) * Math.PI / 180;
      
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      
      const segmentDistance = R * c;
      totalDistance += segmentDistance;
    }
    
    return totalDistance;
  };
  
  // Calculate elevation gain
  const calculateElevationGain = (points) => {
    if (points.length < 2) return 0;
    
    let gain = 0;
    
    for (let i = 0; i < points.length - 1; i++) {
      const elevDiff = points[i + 1].elevation - points[i].elevation;
      if (elevDiff > 0) {
        gain += elevDiff;
      }
    }
    
    return Math.round(gain);
  };
  
  // Estimate duration based on distance
  const estimateDuration = (distance) => {
    // Assume average speed of 1.4 m/s (5 km/h) for walking
    const averageSpeed = 1.4;
    return Math.round(distance / averageSpeed);
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
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Route name is required';
    }
    
    if (!gpxData || !gpxData.points || gpxData.points.length < 2) {
      errors.gpx = 'Valid GPX data with at least 2 points is required';
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
    
    try {
      // Combine form data with GPX data
      const routeData = {
        ...formData,
        points: gpxData.points,
        distance: gpxData.metrics.distance,
        elevationGain: gpxData.metrics.elevationGain,
        duration: gpxData.metrics.duration
      };
      
      await dispatch(importGPX(routeData));
      navigate('/routes');
    } catch (err) {
      console.error('Failed to import GPX:', err);
      setFormErrors({
        ...formErrors,
        general: err.message || 'Failed to import GPX. Please try again.'
      });
    }
  };
  
  return (
    <div className="import-gpx-container">
      <h1>Import GPX File</h1>
      
      {formErrors.general && (
        <div className="error-container">{formErrors.general}</div>
      )}
      
      {parseError && (
        <ErrorMessage message={parseError} />
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Upload GPX File</label>
          <div className="file-upload-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".gpx"
              className="form-control-file"
            />
            <Button
              type="button"
              className="btn-secondary"
              onClick={() => fileInputRef.current.click()}
            >
              Select File
            </Button>
          </div>
          {formErrors.gpx && <div className="error-text">{formErrors.gpx}</div>}
        </div>
        
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
        
        {gpxData && (
          <>
            <div className="map-preview-section">
              <h3>Route Preview</h3>
              <Map
                points={gpxData.points}
                height="500px"
                drawRoute={true}
                showMarkers={true}
              />
            </div>
            
            <div className="route-metrics">
              <h3>Route Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Distance:</span>
                  <span className="metric-value">
                    {(gpxData.metrics.distance / 1000).toFixed(2)} km
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Elevation Gain:</span>
                  <span className="metric-value">
                    {gpxData.metrics.elevationGain} m
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Estimated Duration:</span>
                  <span className="metric-value">
                    {formatDuration(gpxData.metrics.duration)}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Points:</span>
                  <span className="metric-value">
                    {gpxData.points.length}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="form-actions">
          <Button
            type="submit"
            className="btn-primary"
            isLoading={loading}
            disabled={!gpxData}
          >
            Import Route
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

export default ImportGPX;
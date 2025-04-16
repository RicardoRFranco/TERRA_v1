import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// This is a workaround for Leaflet icons with webpack
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({
  points = [],
  height = '500px',
  width = '100%',
  center = [51.505, -0.09],
  zoom = 13,
  showMarkers = true,
  drawRoute = true,
  editable = false,
  onMapClick = null,
  onMarkerDrag = null,
  onRouteChange = null
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Create map instance
      const map = L.map(mapRef.current).setView(center, zoom);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create layers for routes and markers
      routeLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      
      // Set map instance
      mapInstanceRef.current = map;
      
      // Add click handler for editable maps
      if (editable && onMapClick) {
        map.on('click', (e) => {
          onMapClick(e.latlng);
        });
      }
      
      setMapReady(true);
      
      // Cleanup on unmount
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          routeLayerRef.current = null;
          markersLayerRef.current = null;
        }
      };
    }
  }, [center, zoom, editable, onMapClick]);

  // Update map when points change
  useEffect(() => {
    if (mapReady && mapInstanceRef.current && points && points.length > 0) {
      // Clear previous layers
      routeLayerRef.current.clearLayers();
      markersLayerRef.current.clearLayers();
      
      // Draw route if enabled
      if (drawRoute && points.length > 1) {
        const routeLine = L.polyline(points, { color: 'blue', weight: 4 });
        routeLayerRef.current.addLayer(routeLine);
      }
      
      // Add markers if enabled
      if (showMarkers) {
        points.forEach((point, index) => {
          const marker = L.marker(point, { draggable: editable });
          
          // Add popup with point info
          marker.bindPopup(`Point ${index + 1}<br>Lat: ${point[0].toFixed(6)}<br>Lng: ${point[1].toFixed(6)}`);
          
          // Add drag handler for editable markers
          if (editable && onMarkerDrag) {
            marker.on('dragend', (e) => {
              onMarkerDrag(index, [e.target.getLatLng().lat, e.target.getLatLng().lng]);
            });
          }
          
          markersLayerRef.current.addLayer(marker);
        });
      }
      
      // Fit bounds to show all points
      if (points.length > 0) {
        mapInstanceRef.current.fitBounds(L.latLngBounds(points));
      }
    }
  }, [mapReady, points, showMarkers, drawRoute, editable, onMarkerDrag]);
  
  return (
    <div 
      ref={mapRef} 
      className="map-container" 
      style={{ height, width }}
      data-testid="map-container"
    ></div>
  );
};

export default Map;
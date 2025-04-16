"""
Route service module for handling route-related business logic.
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db.repositories.route import RouteRepository
from app.db.models.route import Route, Waypoint
from app.core.exceptions import NotFoundException, ValidationException
from app.utils.geo import calculate_route_distance, estimate_travel_time
from app.utils.validators import validate_coordinates
import xml.etree.ElementTree as ET
import logging

logger = logging.getLogger(__name__)

class RouteService:
    """Service for handling route-related business logic."""
    
    def __init__(self, db: Session):
        """
        Initialize the route service.
        
        Args:
            db: SQLAlchemy database session
        """
        self.repository = RouteRepository(db)
    
    def get_route(self, route_id: int) -> Optional[Route]:
        """
        Get a route by ID.
        
        Args:
            route_id: The ID of the route to retrieve
            
        Returns:
            Route: The retrieved route or None if not found
        """
        route = self.repository.get(route_id)
        if not route:
            logger.info(f"Route with ID {route_id} not found")
        
        return route
    
    def get_user_routes(self, user_id: int) -> List[Route]:
        """
        Get all routes belonging to a user.
        
        Args:
            user_id: The ID of the user
            
        Returns:
            List[Route]: List of routes belonging to the user
        """
        return self.repository.get_user_routes(user_id)
    
    def get_public_routes(self) -> List[Route]:
        """
        Get all public routes.
        
        Returns:
            List[Route]: List of public routes
        """
        return self.repository.get_public_routes()
    
    def create_route(self, route_data: Dict[str, Any], waypoints_data: List[Dict[str, Any]]) -> Route:
        """
        Create a new route with waypoints.
        
        Args:
            route_data: Dictionary containing route information
            waypoints_data: List of dictionaries containing waypoint information
            
        Returns:
            Route: The created route
            
        Raises:
            ValidationException: If waypoints data is invalid
        """
        # Validate waypoints
        if not waypoints_data or len(waypoints_data) < 2:
            raise ValidationException("Route must have at least 2 waypoints")
        
        # Validate coordinates
        for i, waypoint in enumerate(waypoints_data):
            lat = waypoint.get('latitude')
            lon = waypoint.get('longitude')
            
            if not validate_coordinates(lat, lon):
                raise ValidationException(f"Invalid coordinates at waypoint {i+1}: {lat}, {lon}")
        
        # Calculate distance if not provided
        if "distance" not in route_data or not route_data["distance"]:
            route_data["distance"] = calculate_route_distance(waypoints_data)
        
        # Estimate travel time if not provided
        if "estimated_time" not in route_data or not route_data["estimated_time"]:
            travel_mode = route_data.get("travel_mode", "walking")
            route_data["estimated_time"] = estimate_travel_time(route_data["distance"], travel_mode)
        
        # Set start and end points if not provided
        if "start_point" not in route_data or not route_data["start_point"]:
            start = waypoints_data[0]
            route_data["start_point"] = f"{start['latitude']},{start['longitude']}"
            
        if "end_point" not in route_data or not route_data["end_point"]:
            end = waypoints_data[-1]
            route_data["end_point"] = f"{end['latitude']},{end['longitude']}"
        
        logger.info(f"Creating route '{route_data.get('name')}' with {len(waypoints_data)} waypoints")
        return self.repository.create_with_waypoints(route_data, waypoints_data)
    
    def update_route(self, route_id: int, route_data: Dict[str, Any]) -> Optional[Route]:
        """
        Update an existing route.
        
        Args:
            route_id: ID of the route to update
            route_data: Dictionary containing updated route information
            
        Returns:
            Route: The updated route or None if not found
        """
        # Check if route exists
        existing_route = self.get_route(route_id)
        if not existing_route:
            logger.warning(f"Attempted to update non-existent route: {route_id}")
            return None
        
        logger.info(f"Updating route {route_id}")
        return self.repository.update(route_id, route_data)
    
    def delete_route(self, route_id: int) -> bool:
        """
        Delete a route by ID.
        
        Args:
            route_id: ID of the route to delete
            
        Returns:
            bool: True if deletion was successful, False otherwise
        """
        # Check if route exists
        existing_route = self.get_route(route_id)
        if not existing_route:
            logger.warning(f"Attempted to delete non-existent route: {route_id}")
            return False
        
        logger.info(f"Deleting route {route_id}")
        return self.repository.delete(route_id)
    
    def import_gpx(self, user_id: int, gpx_content: str, name: str, description: str = None, is_public: bool = False) -> Route:
        """
        Import a route from GPX file content.
        
        Args:
            user_id: ID of the user who is importing the route
            gpx_content: GPX file content as string
            name: Name for the new route
            description: Description for the new route
            is_public: Whether the route should be public
            
        Returns:
            Route: The created route
            
        Raises:
            ValidationException: If GPX content is invalid or contains no track points
        """
        try:
            # Parse GPX file
            root = ET.fromstring(gpx_content)
            namespace = {'gpx': 'http://www.topografix.com/GPX/1/1'}
            
            # Extract track points
            track_points = []
            for trk in root.findall('.//gpx:trk', namespace):
                for trkseg in trk.findall('.//gpx:trkseg', namespace):
                    for i, trkpt in enumerate(trkseg.findall('.//gpx:trkpt', namespace)):
                        try:
                            lat = float(trkpt.get('lat'))
                            lon = float(trkpt.get('lon'))
                            
                            # Validate coordinates
                            if not validate_coordinates(lat, lon):
                                logger.warning(f"Invalid coordinates in GPX: {lat}, {lon}. Skipping point.")
                                continue
                                
                            name_elem = trkpt.find('.//gpx:name', namespace)
                            point_name = name_elem.text if name_elem is not None else f"Point {i+1}"
                            
                            track_points.append({
                                'latitude': lat,
                                'longitude': lon,
                                'name': point_name,
                                'order': i
                            })
                        except (ValueError, AttributeError) as e:
                            logger.warning(f"Error processing GPX point: {e}. Skipping point.")
            
            if not track_points:
                raise ValidationException("No valid track points found in GPX file")
                
            if len(track_points) < 2:
                raise ValidationException("GPX file must contain at least 2 valid track points")
            
            # Create route data
            route_data = {
                'name': name,
                'description': description,
                'user_id': user_id,
                'start_point': f"{track_points[0]['latitude']},{track_points[0]['longitude']}",
                'end_point': f"{track_points[-1]['latitude']},{track_points[-1]['longitude']}",
                'is_public': is_public,
                'source_type': 'gpx'
            }
            
            # Calculate distance
            distance = calculate_route_distance(track_points)
            route_data['distance'] = distance
            
            # Estimate travel time (assuming hiking for GPX imports)
            route_data['estimated_time'] = estimate_travel_time(distance, 'hiking')
            
            logger.info(f"Importing GPX route '{name}' with {len(track_points)} waypoints")
            
            # Create route with waypoints
            return self.repository.create_with_waypoints(route_data, track_points)
            
        except ET.ParseError as e:
            logger.error(f"Error parsing GPX content: {e}")
            raise ValidationException(f"Invalid GPX format: {str(e)}")
        except Exception as e:
            logger.error(f"Error importing GPX: {e}")
            raise ValidationException(f"Error importing GPX file: {str(e)}")
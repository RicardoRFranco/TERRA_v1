from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db.repositories.route import RouteRepository
from app.db.models.route import Route, Waypoint
import xml.etree.ElementTree as ET
import math

class RouteService:
    def __init__(self, db: Session):
        self.repository = RouteRepository(db)
    
    def get_route(self, route_id: int) -> Optional[Route]:
        return self.repository.get(route_id)
    
    def get_user_routes(self, user_id: int) -> List[Route]:
        return self.repository.get_user_routes(user_id)
    
    def get_public_routes(self) -> List[Route]:
        return self.repository.get_public_routes()
    
    def create_route(self, route_data: Dict[str, Any], waypoints_data: List[Dict[str, Any]]) -> Route:
        # Calculate distance if not provided
        if "distance" not in route_data or not route_data["distance"]:
            route_data["distance"] = self._calculate_route_distance(waypoints_data)
        
        return self.repository.create_with_waypoints(route_data, waypoints_data)
    
    def update_route(self, route_id: int, route_data: Dict[str, Any]) -> Optional[Route]:
        return self.repository.update(route_id, route_data)
    
    def delete_route(self, route_id: int) -> bool:
        return self.repository.delete(route_id)
    
    def import_gpx(self, user_id: int, gpx_content: str, name: str, description: str = None, is_public: bool = False) -> Route:
        # Parse GPX file
        root = ET.fromstring(gpx_content)
        namespace = {'gpx': 'http://www.topografix.com/GPX/1/1'}
        
        # Extract track points
        track_points = []
        for trk in root.findall('.//gpx:trk', namespace):
            for trkseg in trk.findall('.//gpx:trkseg', namespace):
                for i, trkpt in enumerate(trkseg.findall('.//gpx:trkpt', namespace)):
                    lat = float(trkpt.get('lat'))
                    lon = float(trkpt.get('lon'))
                    name_elem = trkpt.find('.//gpx:name', namespace)
                    point_name = name_elem.text if name_elem is not None else f"Point {i+1}"
                    
                    track_points.append({
                        'latitude': lat,
                        'longitude': lon,
                        'name': point_name,
                        'order': i
                    })
        
        if not track_points:
            raise ValueError("No track points found in GPX file")
        
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
        route_data['distance'] = self._calculate_route_distance(track_points)
        
        # Create route with waypoints
        return self.repository.create_with_waypoints(route_data, track_points)
    
    def _calculate_route_distance(self, waypoints: List[Dict[str, Any]]) -> float:
        """Calculate total distance of route in kilometers using Haversine formula"""
        total_distance = 0.0
        
        for i in range(len(waypoints) - 1):
            lat1 = waypoints[i]['latitude']
            lon1 = waypoints[i]['longitude']
            lat2 = waypoints[i + 1]['latitude']
            lon2 = waypoints[i + 1]['longitude']
            
            # Haversine formula
            R = 6371  # Earth radius in kilometers
            dLat = math.radians(lat2 - lat1)
            dLon = math.radians(lon2 - lon1)
            a = (math.sin(dLat/2) * math.sin(dLat/2) +
                 math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
                 math.sin(dLon/2) * math.sin(dLon/2))
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
            distance = R * c
            
            total_distance += distance
        
        return round(total_distance, 2)
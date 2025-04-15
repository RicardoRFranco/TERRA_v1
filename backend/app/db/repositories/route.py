from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from ..models.route import Route, Waypoint
from .base import BaseRepository

class RouteRepository(BaseRepository[Route]):
    def __init__(self, db: Session):
        super().__init__(Route, db)
    
    def get_user_routes(self, user_id: int) -> List[Route]:
        return self.db.query(Route).filter(Route.user_id == user_id).all()
    
    def get_public_routes(self) -> List[Route]:
        return self.db.query(Route).filter(Route.is_public == True).all()
    
    def create_with_waypoints(self, route_data: Dict[str, Any], waypoints_data: List[Dict[str, Any]]) -> Route:
        # Create route
        route = Route(**route_data)
        self.db.add(route)
        self.db.flush()  # Flush to get route ID
        
        # Create waypoints
        for waypoint_data in waypoints_data:
            waypoint_data["route_id"] = route.id
            waypoint = Waypoint(**waypoint_data)
            self.db.add(waypoint)
        
        self.db.commit()
        self.db.refresh(route)
        return route
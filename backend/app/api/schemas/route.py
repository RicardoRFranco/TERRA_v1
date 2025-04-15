from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class WaypointBase(BaseModel):
    name: Optional[str] = None
    latitude: float
    longitude: float
    order: int

class WaypointCreate(WaypointBase):
    pass

class Waypoint(WaypointBase):
    id: int
    route_id: int
    
    class Config:
        orm_mode = True

class RouteBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_point: str
    end_point: str
    distance: Optional[float] = None
    estimated_time: Optional[int] = None
    is_public: bool = False
    source_type: str

class RouteCreate(RouteBase):
    waypoints: List[WaypointCreate]

class Route(RouteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    waypoints: List[Waypoint] = []
    
    class Config:
        orm_mode = True

class GPXImport(BaseModel):
    file_content: str
    name: str
    description: Optional[str] = None
    is_public: bool = False
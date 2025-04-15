from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.models.base import BaseModel

class Route(BaseModel):
    __tablename__ = "routes"
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_point = Column(String, nullable=False)
    end_point = Column(String, nullable=False)
    distance = Column(Float, nullable=True)  # in kilometers
    estimated_time = Column(Integer, nullable=True)  # in minutes
    is_public = Column(Boolean, default=False)
    source_type = Column(String, nullable=False)  # "manual", "google", "gpx"
    
    # Define the relationship using string reference
    user = relationship("User", back_populates="routes")
    waypoints = relationship("Waypoint", back_populates="route", cascade="all, delete-orphan")

class Waypoint(BaseModel):
    __tablename__ = "waypoints"
    
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    name = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    order = Column(Integer, nullable=False)
    
    # Relationships
    route = relationship("Route", back_populates="waypoints")
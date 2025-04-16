"""
Geospatial utilities for the TERRA App.
"""

import math
from typing import List, Dict, Any, Tuple

# Earth radius in kilometers
EARTH_RADIUS_KM = 6371.0


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on Earth using the Haversine formula.
    
    Args:
        lat1: Latitude of the first point in decimal degrees
        lon1: Longitude of the first point in decimal degrees
        lat2: Latitude of the second point in decimal degrees
        lon2: Longitude of the second point in decimal degrees
        
    Returns:
        float: Distance between the points in kilometers
    """
    # Convert decimal degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    # Calculate the distance
    distance = EARTH_RADIUS_KM * c
    
    return distance


def calculate_route_distance(waypoints: List[Dict[str, Any]]) -> float:
    """
    Calculate the total distance of a route based on its waypoints.
    
    Args:
        waypoints: List of waypoint dictionaries containing 'latitude' and 'longitude' keys
        
    Returns:
        float: Total distance of the route in kilometers, rounded to 2 decimal places
    """
    total_distance = 0.0
    
    for i in range(len(waypoints) - 1):
        lat1 = waypoints[i]['latitude']
        lon1 = waypoints[i]['longitude']
        lat2 = waypoints[i + 1]['latitude']
        lon2 = waypoints[i + 1]['longitude']
        
        segment_distance = calculate_haversine_distance(lat1, lon1, lat2, lon2)
        total_distance += segment_distance
    
    return round(total_distance, 2)


def calculate_route_center(waypoints: List[Dict[str, Any]]) -> Tuple[float, float]:
    """
    Calculate the geographical center of a route based on its waypoints.
    
    Args:
        waypoints: List of waypoint dictionaries containing 'latitude' and 'longitude' keys
        
    Returns:
        Tuple[float, float]: The center point as (latitude, longitude)
    """
    if not waypoints:
        return (0.0, 0.0)
    
    # Convert to Cartesian coordinates
    x_sum = 0.0
    y_sum = 0.0
    z_sum = 0.0
    
    for waypoint in waypoints:
        lat = math.radians(waypoint['latitude'])
        lon = math.radians(waypoint['longitude'])
        
        x = math.cos(lat) * math.cos(lon)
        y = math.cos(lat) * math.sin(lon)
        z = math.sin(lat)
        
        x_sum += x
        y_sum += y
        z_sum += z
    
    # Calculate average
    x_avg = x_sum / len(waypoints)
    y_avg = y_sum / len(waypoints)
    z_avg = z_sum / len(waypoints)
    
    # Convert back to latitude and longitude
    lon_center = math.atan2(y_avg, x_avg)
    hyp = math.sqrt(x_avg * x_avg + y_avg * y_avg)
    lat_center = math.atan2(z_avg, hyp)
    
    # Convert to degrees
    lat_center_deg = math.degrees(lat_center)
    lon_center_deg = math.degrees(lon_center)
    
    return (round(lat_center_deg, 6), round(lon_center_deg, 6))


def estimate_travel_time(distance_km: float, travel_mode: str = 'walking') -> int:
    """
    Estimate travel time in minutes based on distance and travel mode.
    
    Args:
        distance_km: Distance in kilometers
        travel_mode: Mode of transportation ('walking', 'cycling', 'driving')
        
    Returns:
        int: Estimated travel time in minutes
    """
    # Average speeds in km/h
    speeds = {
        'walking': 5.0,     # Average walking speed
        'hiking': 4.0,      # Average hiking speed
        'running': 10.0,    # Average running speed
        'cycling': 20.0,    # Average cycling speed
        'driving': 60.0     # Average driving speed
    }
    
    # Default to walking if travel mode is not recognized
    speed = speeds.get(travel_mode.lower(), speeds['walking'])
    
    # Calculate time in hours, then convert to minutes
    time_hours = distance_km / speed
    time_minutes = int(round(time_hours * 60))
    
    return max(1, time_minutes)  # Ensure at least 1 minute
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.services.route_service import RouteService
from app.api.schemas.route import Route, RouteCreate, GPXImport
from app.api.routes.auth import get_current_user
from app.db.models.user import User

router = APIRouter()

@router.post("/", response_model=Route, status_code=status.HTTP_201_CREATED)
async def create_route(
    route_data: RouteCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    route_service = RouteService(db)
    
    # Prepare data for service
    route_dict = route_data.dict(exclude={"waypoints"})
    route_dict["user_id"] = current_user.id
    waypoints_data = [wp.dict() for wp in route_data.waypoints]
    
    # Create route
    route = route_service.create_route(route_dict, waypoints_data)
    return route

@router.get("/", response_model=List[Route])
async def get_routes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    public_only: bool = False
):
    route_service = RouteService(db)
    
    if public_only:
        routes = route_service.get_public_routes()
    else:
        routes = route_service.get_user_routes(current_user.id)
    
    return routes

@router.get("/{route_id}", response_model=Route)
async def get_route(
    route_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    route_service = RouteService(db)
    route = route_service.get_route(route_id)
    
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found"
        )
    
    # Check if user has access
    if route.user_id != current_user.id and not route.is_public:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this route"
        )
    
    return route

@router.put("/{route_id}", response_model=Route)
async def update_route(
    route_id: int,
    route_data: RouteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    route_service = RouteService(db)
    
    # Check if route exists and belongs to user
    existing_route = route_service.get_route(route_id)
    if not existing_route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found"
        )
    
    if existing_route.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this route"
        )
    
    # Update route
    route_dict = route_data.dict(exclude={"waypoints"})
    updated_route = route_service.update_route(route_id, route_dict)
    
    return updated_route

@router.delete("/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_route(
    route_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    route_service = RouteService(db)
    
    # Check if route exists and belongs to user
    existing_route = route_service.get_route(route_id)
    if not existing_route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found"
        )
    
    if existing_route.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this route"
        )
    
    # Delete route
    route_service.delete_route(route_id)
    return None

@router.post("/import-gpx", response_model=Route)
async def import_gpx_file(
    name: str,
    description: Optional[str] = None,
    is_public: bool = False,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    route_service = RouteService(db)
    
    # Read GPX file content
    gpx_content = await file.read()
    
    try:
        # Import GPX and create route
        route = route_service.import_gpx(
            user_id=current_user.id,
            gpx_content=gpx_content.decode('utf-8'),
            name=name,
            description=description,
            is_public=is_public
        )
        return route
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error importing GPX file: {str(e)}"
        )
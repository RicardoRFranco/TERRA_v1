import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getRoutes } from '../store/actions';
import RouteList from '../components/routes/RouteList';

const RoutesList = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getRoutes(true)); // Get user's routes
  }, [dispatch]);

  return (
    <div className="routes-list-page">
      <div className="page-header">
        <h1>My Routes</h1>
        <div className="page-actions">
          <Link to="/routes/create" className="btn btn-primary">
            Create New Route
          </Link>
          <Link to="/import-gpx" className="btn btn-secondary">
            Import GPX
          </Link>
        </div>
      </div>
      
      <RouteList userRoutesOnly={true} />
    </div>
  );
};

export default RoutesList;
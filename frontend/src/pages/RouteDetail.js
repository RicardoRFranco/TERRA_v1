import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getRouteById } from '../store/actions';
import RouteDetailComponent from '../components/routes/RouteDetail';

const RouteDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getRouteById(id));
    }
  }, [dispatch, id]);

  return (
    <div className="route-detail-page">
      <RouteDetailComponent />
    </div>
  );
};

export default RouteDetail;
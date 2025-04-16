// frontend/src/pages/Routes/RoutesList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { fetchRoutes, deleteRoute } from '../../store/actions/routeActions';

const RoutesList = () => {
    const dispatch = useDispatch();
    const { routes, loading } = useSelector(state => state.routes);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Fetch routes on component mount
    useEffect(() => {
        dispatch(fetchRoutes());
    }, [dispatch]);

    // Handle route deletion
    const handleDeleteRoute = (id) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            dispatch(deleteRoute(id));
        }
    };

    // Filter routes based on search term and filter type
    const filteredRoutes = routes.filter(route => {
        const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
        if (filterType === 'all') return matchesSearch;
        if (filterType === 'public') return matchesSearch && route.is_public;
        if (filterType === 'private') return matchesSearch && !route.is_public;
        if (filterType === 'manual') return matchesSearch && route.source_type === 'manual';
        if (filterType === 'gpx') return matchesSearch && route.source_type === 'gpx';
        
        return matchesSearch;
    });

    // Format distance
    const formatDistance = (distance) => {
        if (!distance) return 'Unknown';
        return `${distance.toFixed(2)} km`;
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Format estimated time
    const formatTime = (minutes) => {
        if (!minutes) return 'Unknown';
        
        if (minutes < 60) {
            return `${minutes} min`;
        }
        
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (remainingMinutes === 0) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        }
        
        return `${hours}h ${remainingMinutes}m`;
    };

    return (
        <DashboardLayout>
            {loading && <LoadingOverlay />}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Routes</h1>
                    <p className="text-gray-600 mt-1">View and manage your saved routes</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Button 
                        to="/create" 
                        variant="primary"
                        icon={
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        }
                    >
                        Create New Route
                    </Button>
                </div>
            </div>

            {/* Search and Filter */}
            <Card className="mb-6" padding="normal">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Search */}
                    <div className="flex-grow">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search routes..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="w-full md:w-64">
                        <select
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Routes</option>
                            <option value="public">Public Routes</option>
                            <option value="private">Private Routes</option>
                            <option value="manual">Manually Created</option>
                            <option value="gpx">GPX Imported</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Routes List */}
            {filteredRoutes.length === 0 ? (
                <Card className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No routes found</h3>
                    <p className="mt-1 text-gray-500">
                        {searchTerm || filterType !== 'all' 
                            ? 'Try adjusting your search or filter criteria.' 
                            : 'Create your first route to get started.'}
                    </p>
                    {!searchTerm && filterType === 'all' && (
                        <div className="mt-6">
                            <Button 
                                to="/create" 
                                variant="primary"
                            >
                                Create New Route
                            </Button>
                        </div>
                    )}
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredRoutes.map(route => (
                        <Card 
                            key={route.id}
                            title={route.name}
                            subtitle={formatDate(route.created_at)}
                            content={
                                <div className="space-y-2">
                                    {route.description && (
                                        <p className="text-gray-600 line-clamp-2">{route.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {formatDistance(route.distance)}
                                        </span>
                                        {route.estimated_time && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {formatTime(route.estimated_time)}
                                            </span>
                                        )}
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            route.is_public 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {route.is_public ? 'Public' : 'Private'}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            {route.source_type === 'gpx' ? 'GPX Import' : 'Manual'}
                                        </span>
                                    </div>
                                </div>
                            }
                            footer={
                                <div className="flex justify-between">
                                    <Button 
                                        to={`/routes/${route.id}`}
                                        variant="link"
                                        size="small"
                                    >
                                        View Details
                                    </Button>
                                    <Button 
                                        onClick={() => handleDeleteRoute(route.id)}
                                        variant="danger"
                                        size="small"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            }
                            className="h-full flex flex-col"
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default RoutesList;
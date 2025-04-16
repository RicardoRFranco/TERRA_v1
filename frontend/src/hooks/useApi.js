import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

/**
 * Custom hook for API data fetching with caching and refetching capabilities
 * 
 * @param {string} endpoint - API endpoint path (without base URL)
 * @param {Object} options - Configuration options
 * @param {boolean} options.loadOnMount - Whether to load data on component mount
 * @param {Object} options.params - Query parameters
 * @param {boolean} options.cacheResults - Whether to cache results
 * @returns {Object} - API hook state and control functions
 */
const useApi = (endpoint, options = {}) => {
    const { 
        loadOnMount = true, 
        params = {}, 
        cacheResults = false 
    } = options;
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(loadOnMount);
    const [error, setError] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [timestamp, setTimestamp] = useState(null);

    /**
     * Format query parameters for URL
     * @param {Object} params - Query parameters
     * @returns {string} Formatted query string
     */
    const formatQueryParams = (params) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value);
            }
        });
        
        const queryString = queryParams.toString();
        return queryString ? `?${queryString}` : '';
    };

    /**
     * Fetch data from API
     * @param {Object} customParams - Custom query params to merge with default params
     * @returns {Promise} - Fetch result
     */
    const fetchData = useCallback(async (customParams = {}) => {
        try {
            setLoading(true);
            setHasError(false);
            
            // Merge default params with custom params
            const mergedParams = { ...params, ...customParams };
            const queryString = formatQueryParams(mergedParams);
            const url = `${endpoint}${queryString}`;
            
            // Check if data is cached
            const cacheKey = `api_cache_${url}`;
            if (cacheResults) {
                const cachedData = localStorage.getItem(cacheKey);
                if (cachedData) {
                    try {
                        const { data: cachedResult, timestamp: cachedTimestamp } = JSON.parse(cachedData);
                        const cacheAge = Date.now() - cachedTimestamp;
                        
                        // Use cache if it's less than 5 minutes old
                        if (cacheAge < 5 * 60 * 1000) {
                            setData(cachedResult);
                            setTimestamp(cachedTimestamp);
                            setLoading(false);
                            return cachedResult;
                        }
                    } catch (e) {
                        // Invalid cache, continue with API call
                        console.warn('Invalid cache data:', e);
                    }
                }
            }
            
            // Make API request
            const response = await apiService.api.get(url);
            const result = response.data;
            
            // Cache result if needed
            if (cacheResults) {
                const now = Date.now();
                localStorage.setItem(cacheKey, JSON.stringify({ 
                    data: result, 
                    timestamp: now 
                }));
                setTimestamp(now);
            }
            
            setData(result);
            setError(null);
            setLoading(false);
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
            setError(errorMessage);
            setHasError(true);
            setLoading(false);
            throw err;
        }
    }, [endpoint, params, cacheResults]);

    // Load data on mount if needed
    useEffect(() => {
        if (loadOnMount) {
            fetchData();
        }
        
        // Cleanup function
        return () => {
            // Any cleanup needed
        };
    }, [fetchData, loadOnMount]);

    /**
     * Invalidate cache for this endpoint
     */
    const invalidateCache = useCallback(() => {
        if (cacheResults) {
            const queryString = formatQueryParams(params);
            const url = `${endpoint}${queryString}`;
            const cacheKey = `api_cache_${url}`;
            localStorage.removeItem(cacheKey);
        }
    }, [endpoint, params, cacheResults]);

    return {
        data,               // The fetched data
        loading,            // Loading state
        error,              // Error message if any
        hasError,           // Boolean flag for error state
        refetch: fetchData, // Function to manually refetch data
        invalidateCache,    // Function to clear the cache
        timestamp           // When the data was last fetched
    };
};

export default useApi;
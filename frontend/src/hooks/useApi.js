import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for making API requests with loading and error states
 * 
 * @param {Function} apiFunction - API function to call
 * @param {Array} dependencies - Dependencies to trigger automatic API call
 * @param {boolean} immediate - Whether to call API immediately
 * @param {Array} params - Parameters to pass to API function
 * @returns {Object} { data, loading, error, execute }
 */
const useApi = (apiFunction, { dependencies = [], immediate = true, params = [] } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  
  // Function to execute the API call
  const execute = useCallback(async (...customParams) => {
    // Use custom params if provided, otherwise use default params
    const paramsToUse = customParams.length > 0 ? customParams : params;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction(...paramsToUse);
      const result = response?.data !== undefined ? response.data : response;
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, ...params]);
  
  // Call API immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [...dependencies]);
  
  return { data, loading, error, execute };
};

export default useApi;
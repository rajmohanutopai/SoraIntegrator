import Logger from '../loggerService';

/**
 * Middleware for logging API requests and responses
 * To be used with axios interceptors
 */

// Create a logger instance for API operations
const apiLogger = Logger.createLogger('API');

/**
 * Request interceptor to log outgoing API requests
 * @param {Object} config - Axios request config
 * @returns {Object} Modified config
 */
export function requestInterceptor(config) {
  const startTime = Date.now();
  
  // Add start time to config for response timing
  config.metadata = { startTime };
  
  // Build URL for logging
  const url = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
  
  // Log the request
  apiLogger.logApiRequest(
    url,
    config.method.toUpperCase(),
    config.data
  );
  
  return config;
}

/**
 * Response interceptor to log API responses
 * @param {Object} response - Axios response
 * @returns {Object} Unmodified response
 */
export function responseInterceptor(response) {
  const { config, status, data } = response;
  const url = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
  const method = config.method.toUpperCase();
  
  // Calculate response time if available
  let responseTime = null;
  if (config.metadata && config.metadata.startTime) {
    responseTime = Date.now() - config.metadata.startTime;
  }
  
  // Log the response
  apiLogger.logApiResponse(
    url,
    method,
    status,
    data,
    responseTime
  );
  
  return response;
}

/**
 * Error interceptor to log API errors
 * @param {Error} error - Axios error
 * @returns {Promise} Rejected promise with error
 */
export function errorInterceptor(error) {
  // Get response details if available
  const { config, response } = error;
  
  if (config) {
    const url = config.baseURL ? `${config.baseURL}${config.url}` : config.url;
    const method = config.method.toUpperCase();
    
    // Calculate response time if available
    let responseTime = null;
    if (config.metadata && config.metadata.startTime) {
      responseTime = Date.now() - config.metadata.startTime;
    }
    
    if (response) {
      // HTTP error with response
      apiLogger.logApiResponse(
        url,
        method,
        response.status,
        response.data,
        responseTime
      );
    } else {
      // Network or other error
      apiLogger.error(`API Request Failed: ${method} ${url}`, {
        message: error.message,
        responseTime
      });
    }
  } else {
    // Generic error without config
    apiLogger.error('API Error', { message: error.message });
  }
  
  return Promise.reject(error);
}

export default {
  requestInterceptor,
  responseInterceptor,
  errorInterceptor
};
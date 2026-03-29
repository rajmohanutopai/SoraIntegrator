/**
 * Logger service for frontend application
 * Provides consistent logging across the application with configurable levels
 * and production/development differentiation
 */

// Log levels
const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

// Default configuration
const defaultConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  remoteUrl: '/api/logs', // API endpoint for remote logging
  appName: 'VideoPipeline',
  maxRetries: 3,
  includeTimestamp: true,
  bufferSize: 10, // Buffer size for remote logging
  session: generateSessionId()
};

// Current configuration
let config = { ...defaultConfig };

// Buffer for remote logs
let logBuffer = [];

// Generate a unique session ID
function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Configure the logger
 * @param {Object} options - Configuration options
 */
function configure(options = {}) {
  config = { ...config, ...options };
  
  if (config.enableConsole && config.minLevel === LogLevel.DEBUG) {
    console.log(`[${config.appName}] Logger initialized with session ${config.session}`);
  }
}

/**
 * Format a log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 * @returns {Object} Formatted log object
 */
function formatLog(level, message, data = null) {
  const timestamp = config.includeTimestamp ? new Date().toISOString() : null;
  
  return {
    timestamp,
    level,
    message,
    data,
    appName: config.appName,
    session: config.session,
    url: window.location.href,
    userAgent: navigator.userAgent
  };
}

/**
 * Log to console if enabled
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
function logToConsole(level, message, data) {
  if (!config.enableConsole) return;
  
  const timestamp = config.includeTimestamp ? `[${new Date().toISOString()}]` : '';
  const prefix = `${timestamp} [${config.appName}] [${level.toUpperCase()}]`;
  
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(prefix, message, data || '');
      break;
    case LogLevel.INFO:
      console.info(prefix, message, data || '');
      break;
    case LogLevel.WARN:
      console.warn(prefix, message, data || '');
      break;
    case LogLevel.ERROR:
      console.error(prefix, message, data || '');
      break;
    default:
      console.log(prefix, message, data || '');
  }
}

/**
 * Queue a log for remote sending
 * @param {Object} logData - Log data to queue
 */
function queueRemoteLog(logData) {
  if (!config.enableRemote) return;
  
  logBuffer.push(logData);
  
  // If buffer is full, send logs
  if (logBuffer.length >= config.bufferSize) {
    sendRemoteLogs();
  }
}

/**
 * Send logs to remote endpoint
 * @param {boolean} force - Force sending even if buffer isn't full
 * @param {number} retry - Current retry count
 */
function sendRemoteLogs(force = false, retry = 0) {
  if (!config.enableRemote || (logBuffer.length === 0 && !force)) return;
  
  const logsToSend = [...logBuffer];
  
  // Only clear buffer on first attempt
  if (retry === 0) {
    logBuffer = [];
  }
  
  fetch(config.remoteUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ logs: logsToSend }),
  })
  .catch(error => {
    // If failed and under retry limit, try again
    if (retry < config.maxRetries) {
      setTimeout(() => {
        sendRemoteLogs(true, retry + 1);
      }, 1000 * (retry + 1)); // Exponential backoff
    } else if (config.enableConsole) {
      console.error(`[${config.appName}] Failed to send logs to remote endpoint:`, error);
      
      // Add back to buffer on final failure
      logBuffer = [...logBuffer, ...logsToSend];
    }
  });
}

/**
 * Log a message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
function log(level, message, data = null) {
  // Check log level
  const levels = Object.values(LogLevel);
  const configLevelIndex = levels.indexOf(config.minLevel);
  const logLevelIndex = levels.indexOf(level);
  
  if (logLevelIndex < configLevelIndex) return;
  
  // Format log
  const logData = formatLog(level, message, data);
  
  // Log to console
  logToConsole(level, message, data);
  
  // Queue for remote logging
  queueRemoteLog(logData);
}

/**
 * Log debug message
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
function debug(message, data = null) {
  log(LogLevel.DEBUG, message, data);
}

/**
 * Log info message
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
function info(message, data = null) {
  log(LogLevel.INFO, message, data);
}

/**
 * Log warning message
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
function warn(message, data = null) {
  log(LogLevel.WARN, message, data);
}

/**
 * Log error message
 * @param {string} message - Log message
 * @param {Object} data - Additional data
 */
function error(message, data = null) {
  log(LogLevel.ERROR, message, data);
}

/**
 * Log API request
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} data - Request data
 */
function logApiRequest(endpoint, method = 'GET', data = null) {
  info(`API Request: ${method} ${endpoint}`, { method, data });
}

/**
 * Log API response
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {number} status - HTTP status code
 * @param {Object} data - Response data
 * @param {number} time - Response time in ms
 */
function logApiResponse(endpoint, method = 'GET', status, data = null, time = null) {
  const logData = { method, status };
  
  if (time !== null) {
    logData.responseTime = `${time}ms`;
  }
  
  if (data !== null) {
    // Don't log full response data to avoid excessive logging
    logData.dataSize = typeof data === 'object' ? JSON.stringify(data).length : String(data).length;
  }
  
  if (status >= 400) {
    error(`API Error: ${method} ${endpoint} (${status})`, { ...logData, error: data?.error || 'Unknown error' });
  } else {
    info(`API Response: ${method} ${endpoint} (${status})`, logData);
  }
}

/**
 * Log user interaction
 * @param {string} action - User action
 * @param {Object} details - Action details
 */
function logUserAction(action, details = null) {
  info(`User Action: ${action}`, details);
}

/**
 * Log application error with stack trace
 * @param {Error} error - Error object
 * @param {string} context - Error context
 * @param {Object} additionalData - Additional data
 */
function logError(error, context = 'Application', additionalData = null) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    ...additionalData
  };
  
  error(`${context} Error: ${error.message}`, errorData);
}

/**
 * Create a custom logger with a specific prefix
 * @param {string} prefix - Logger prefix
 * @returns {Object} Custom logger
 */
function createLogger(prefix) {
  return {
    debug: (message, data) => debug(`[${prefix}] ${message}`, data),
    info: (message, data) => info(`[${prefix}] ${message}`, data),
    warn: (message, data) => warn(`[${prefix}] ${message}`, data),
    error: (message, data) => error(`[${prefix}] ${message}`, data),
    logApiRequest: (endpoint, method, data) => logApiRequest(endpoint, method, data),
    logApiResponse: (endpoint, method, status, data, time) => logApiResponse(endpoint, method, status, data, time),
    logUserAction: (action, details) => logUserAction(action, details),
    logError: (error, context, data) => logError(error, `${prefix}:${context}`, data)
  };
}

// Setup event listeners for window unload to send any remaining logs
window.addEventListener('beforeunload', () => {
  sendRemoteLogs(true);
});

// Setup error handling
window.addEventListener('error', (event) => {
  logError(event.error || new Error(event.message), 'Uncaught Exception', {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  logError(error, 'Unhandled Promise Rejection');
});

// Export the logger
const Logger = {
  configure,
  debug,
  info,
  warn,
  error,
  logApiRequest,
  logApiResponse,
  logUserAction,
  logError,
  createLogger,
  LogLevel
};

export default Logger;
import axios from 'axios';
import Logger from './loggerService';
import apiLogger from './api/apiLogger';

// Initialize logger
Logger.configure({
  appName: 'VideoPipeline-Frontend',
  // Remote logging can be enabled when backend endpoint is ready
  enableRemote: false
});

const logger = Logger.createLogger('API-Service');

const API_URL = process.env.REACT_APP_API_URL || '/api';

logger.info(`Initializing API client with base URL: ${API_URL}`);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000, // 30 seconds
});

// Add request/response interceptors for logging
api.interceptors.request.use(
  apiLogger.requestInterceptor,
  apiLogger.errorInterceptor
);

api.interceptors.response.use(
  apiLogger.responseInterceptor,
  apiLogger.errorInterceptor
);

// Project API
export const getProjects = () => {
  logger.debug('Fetching all projects');
  return api.get('/projects');
};

export const getProject = (id) => {
  logger.debug(`Fetching project details for project ${id}`);
  return api.get(`/projects/${id}`);
};

export const createProject = (title) => {
  logger.info(`Creating new project with title: ${title}`);
  return api.post('/projects', { title });
};

export const deleteProject = (id) => {
  logger.info(`Deleting project ${id}`);
  return api.delete(`/projects/${id}`);
};

// Idea API
export const expandIdea = (projectId, rawIdea) => {
  logger.info(`Expanding idea for project ${projectId}`);
  logger.debug(`Raw idea length: ${rawIdea.length} characters`);
  return api.post('/idea/expand', { project_id: projectId, raw_idea: rawIdea });
};

export const updateIdea = (ideaId, data) => {
  const operation = data.approved !== undefined 
    ? (data.approved ? 'approving' : 'unapproving') 
    : 'updating';
  logger.info(`${operation} idea ${ideaId}`);
  return api.put(`/idea/${ideaId}`, data);
};

// Storyboard API
export const generateStoryboard = (projectId) => {
  logger.info(`Generating storyboard for project ${projectId}`);
  return api.post('/storyboard/generate', { project_id: projectId });
};

export const updateStoryboard = (storyboardId, data) => {
  const operation = data.approved !== undefined 
    ? (data.approved ? 'approving' : 'unapproving') 
    : 'updating';
  logger.info(`${operation} storyboard ${storyboardId}`);
  return api.put(`/storyboard/${storyboardId}`, data);
};

// Image API
export const generateImage = (storyboardId, sceneIndex, prompt) => {
  logger.info(`Generating image for storyboard ${storyboardId}, scene ${sceneIndex}`);
  logger.debug(`Image prompt length: ${prompt.length} characters`);
  return api.post('/images/generate', { 
    storyboard_id: storyboardId, 
    scene_index: sceneIndex, 
    prompt 
  });
};

export const regenerateImage = (imageId, prompt) => {
  logger.info(`Regenerating image ${imageId}`);
  logger.debug(`New image prompt length: ${prompt.length} characters`);
  return api.put(`/images/${imageId}/regenerate`, { prompt });
};

// Video API
export const generateVideo = (projectId, settings) => {
  logger.info(`Generating video for project ${projectId}`);
  logger.debug(`Video settings: ${JSON.stringify(settings)}`);
  return api.post('/videos/generate', { project_id: projectId, settings });
};

export const regenerateVideo = (videoId, settings) => {
  logger.info(`Regenerating video ${videoId}`);
  logger.debug(`New video settings: ${JSON.stringify(settings)}`);
  return api.put(`/videos/${videoId}/regenerate`, { settings });
};

export default api;
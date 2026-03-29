import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProjects, deleteProject } from '../../services/api';

const HistoryDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (err) {
      setError('Failed to delete project');
      console.error(err);
    }
  };
  
  const handleCreateNew = () => {
    navigate('/new-project');
  };
  
  // Filter projects based on search term and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg">Loading your projects...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-2">
      <div className="mb-4">
        <p className="text-sm text-luxury-taupe">Manage and track your video creation projects</p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="w-full md:w-1/3 mb-2 md:mb-0 md:mr-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 border border-luxury-silver/30 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luxury-gold/50 focus:border-luxury-gold"
          />
        </div>
        <div className="w-full md:w-1/4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-1.5 border border-luxury-silver/30 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-luxury-gold/50 focus:border-luxury-gold"
          >
            <option value="all">All Projects</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Project List */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-luxury-cream rounded-lg shadow-md overflow-hidden border border-luxury-silver/30">
              <div className="p-3">
                <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Project Status Indicators */}
                <div className="flex space-x-2 mb-2">
                  <div className={`h-2 w-2 rounded-full ${project.idea ? 'bg-luxury-gold' : 'bg-gray-300'}`}></div>
                  <div className={`h-2 w-2 rounded-full ${project.storyboard ? 'bg-luxury-gold' : 'bg-gray-300'}`}></div>
                  <div className={`h-2 w-2 rounded-full ${
                    project.storyboard && project.storyboard.images && project.storyboard.images.length > 0 
                      ? 'bg-luxury-gold' : 'bg-gray-300'
                  }`}></div>
                  <div className={`h-2 w-2 rounded-full ${
                    project.videos && project.videos.length > 0 ? 'bg-luxury-gold' : 'bg-gray-300'
                  }`}></div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Link
                    to={`/projects/${project.id}`}
                    className="px-3 py-1 bg-luxury-gold text-luxury-charcoal text-sm font-medium rounded-md shadow-sm hover:bg-opacity-90"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="px-3 py-1 text-sm text-luxury-burgundy font-medium rounded-md hover:bg-luxury-burgundy/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-luxury-cream rounded-lg border border-luxury-silver/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-luxury-taupe mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-luxury-taupe text-base mb-3">No projects found</p>
          <Link to="/new-project">
            <button
              className="px-4 py-2 bg-luxury-gold text-luxury-charcoal font-medium rounded-md shadow-sm hover:bg-opacity-90"
            >
              Create a Video
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HistoryDashboard;
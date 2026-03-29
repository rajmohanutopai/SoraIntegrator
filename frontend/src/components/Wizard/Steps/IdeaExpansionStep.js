import React, { useState } from 'react';
import { updateIdea } from '../../../services/api';

const IdeaExpansionStep = ({ project, onNext, onPrev, updateProject }) => {
  const [expandedIdea, setExpandedIdea] = useState(project.idea?.expanded_idea || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ensure we have the required idea structure
  if (!project.idea) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">No idea found. Please go back and create an idea first.</p>
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
        >
          Back to Idea Input
        </button>
      </div>
    );
  }
  
  const handleApprove = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await updateIdea(project.idea.id, {
        expanded_idea: expandedIdea,
        approved: true
      });
      
      updateProject({
        ...project,
        idea: response.data
      });
      
      onNext();
    } catch (err) {
      setError('Failed to save changes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (field, value) => {
    setExpandedIdea({
      ...expandedIdea,
      [field]: value
    });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Expanded Idea</h2>
      
      <p className="mb-6 text-gray-600">
        We've expanded your idea into a structured format. Feel free to edit any part before proceeding.
      </p>
      
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={expandedIdea.title || ''}
            onChange={(e) => handleEdit('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={expandedIdea.description || ''}
            onChange={(e) => handleEdit('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Key Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Key Points
          </label>
          {Array.isArray(expandedIdea.key_points) && expandedIdea.key_points.map((point, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={point}
                onChange={(e) => {
                  const newPoints = [...expandedIdea.key_points];
                  newPoints[index] = e.target.value;
                  handleEdit('key_points', newPoints);
                }}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  const newPoints = expandedIdea.key_points.filter((_, i) => i !== index);
                  handleEdit('key_points', newPoints);
                }}
                className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newPoints = [...(expandedIdea.key_points || []), ''];
              handleEdit('key_points', newPoints);
            }}
            className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
          >
            Add Key Point
          </button>
        </div>
        
        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mood/Tone
          </label>
          <input
            type="text"
            value={expandedIdea.mood || ''}
            onChange={(e) => handleEdit('mood', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience
          </label>
          <input
            type="text"
            value={expandedIdea.target_audience || ''}
            onChange={(e) => handleEdit('target_audience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      {error && (
        <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleApprove}
          disabled={loading}
          className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Saving...' : 'Approve & Continue'}
        </button>
      </div>
    </div>
  );
};

export default IdeaExpansionStep;
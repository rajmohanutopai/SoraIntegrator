import React, { useState, useEffect } from 'react';
import { generateStoryboard, updateStoryboard } from '../../../services/api';

const StoryboardStep = ({ project, onNext, onPrev, updateProject }) => {
  const [storyboard, setStoryboard] = useState(project.storyboard || null);
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if we need to generate a storyboard
  useEffect(() => {
    if (!storyboard && !generating) {
      handleGenerateStoryboard();
    } else if (storyboard && storyboard.scenes) {
      setScenes(storyboard.scenes);
    }
  }, [storyboard, generating]);
  
  // Ensure we have the required idea
  if (!project.idea || !project.idea.approved) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Please approve your expanded idea before creating a storyboard.</p>
        <button
          onClick={() => onPrev()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
        >
          Back to Idea
        </button>
      </div>
    );
  }
  
  const handleGenerateStoryboard = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await generateStoryboard(project.id);
      setStoryboard(response.data);
      setScenes(response.data.scenes);
      
      // Update the project with the new storyboard
      updateProject({
        ...project,
        storyboard: response.data
      });
    } catch (err) {
      setError('Failed to generate storyboard. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };
  
  const handleSceneUpdate = (index, field, value) => {
    const updatedScenes = [...scenes];
    updatedScenes[index] = {
      ...updatedScenes[index],
      [field]: value
    };
    setScenes(updatedScenes);
  };
  
  const handleApprove = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await updateStoryboard(storyboard.id, {
        scenes: scenes,
        approved: true
      });
      
      updateProject({
        ...project,
        storyboard: response.data
      });
      
      onNext();
    } catch (err) {
      setError('Failed to save storyboard. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  if (generating) {
    return (
      <div className="text-center py-10">
        <svg className="animate-spin h-10 w-10 mx-auto text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-medium">Generating your storyboard...</p>
        <p className="text-gray-500 mt-2">This may take a minute as we create scenes for your video.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Storyboard</h2>
      
      <p className="mb-6 text-gray-600">
        Review and edit your storyboard. Each scene will be used to generate an image in the next step.
      </p>
      
      <div className="space-y-8 mb-8">
        {scenes.map((scene, index) => (
          <div key={index} className="border p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Scene {scene.scene_number || index + 1}</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                {index === 0 ? 'Intro' : index === scenes.length - 1 ? 'Conclusion' : `Key Point ${index}`}
              </span>
            </div>
            
            <div className="space-y-4">
              {/* Scene Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={scene.description || ''}
                  onChange={(e) => handleSceneUpdate(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Image Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Prompt (For AI Generation)
                </label>
                <textarea
                  rows={3}
                  value={scene.image_prompt || ''}
                  onChange={(e) => handleSceneUpdate(index, 'image_prompt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* On-Screen Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  On-Screen Text
                </label>
                <input
                  type="text"
                  value={scene.on_screen_text || ''}
                  onChange={(e) => handleSceneUpdate(index, 'on_screen_text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {scenes.length === 0 && !generating && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">No storyboard scenes have been created yet.</p>
          <button
            onClick={handleGenerateStoryboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
          >
            Generate Storyboard
          </button>
        </div>
      )}
      
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
        
        <div>
          {scenes.length > 0 && (
            <button
              type="button"
              onClick={handleGenerateStoryboard}
              className="mr-4 px-4 py-2 border border-blue-300 text-blue-700 rounded-md shadow-sm hover:bg-blue-50"
            >
              Regenerate
            </button>
          )}
          
          <button
            type="button"
            onClick={handleApprove}
            disabled={loading || scenes.length === 0}
            className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm ${
              loading || scenes.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Saving...' : 'Approve & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryboardStep;
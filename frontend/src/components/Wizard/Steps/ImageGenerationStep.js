import React, { useState, useEffect } from 'react';
import { generateImage, regenerateImage } from '../../../services/api';

const ImageGenerationStep = ({ project, onNext, onPrev, updateProject }) => {
  const [storyboard, setStoryboard] = useState(project.storyboard || null);
  const [images, setImages] = useState([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  // Load existing images and ensure storyboard exists
  useEffect(() => {
    if (storyboard && storyboard.images) {
      // Sort images by scene index
      const sortedImages = [...storyboard.images].sort((a, b) => a.scene_index - b.scene_index);
      setImages(sortedImages);
    }
  }, [storyboard]);
  
  // Ensure we have the required storyboard
  if (!project.storyboard || !project.storyboard.approved) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Please approve your storyboard before generating images.</p>
        <button
          onClick={() => onPrev()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
        >
          Back to Storyboard
        </button>
      </div>
    );
  }
  
  const handleGenerateImage = async (sceneIndex) => {
    try {
      setGenerating(true);
      setError(null);
      
      // Get scene information for the prompt
      const scene = storyboard.scenes[sceneIndex];
      if (!scene) {
        throw new Error(`Scene ${sceneIndex} not found in storyboard`);
      }
      
      // Generate image using the image prompt from the scene
      const response = await generateImage(
        storyboard.id, 
        sceneIndex, 
        scene.image_prompt
      );
      
      // Update local state with the new image
      const existingImageIndex = images.findIndex(img => img.scene_index === sceneIndex);
      
      if (existingImageIndex >= 0) {
        // Update existing image
        const updatedImages = [...images];
        updatedImages[existingImageIndex] = response.data;
        setImages(updatedImages);
      } else {
        // Add new image
        setImages([...images, response.data]);
      }
      
      // Update the project with the new image
      const updatedStoryboard = {
        ...storyboard,
        images: [...(storyboard.images || [])].filter(img => img.scene_index !== sceneIndex)
      };
      updatedStoryboard.images.push(response.data);
      
      setStoryboard(updatedStoryboard);
      updateProject({
        ...project,
        storyboard: updatedStoryboard
      });
      
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };
  
  const handleRegenerateImage = async (imageId, prompt) => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await regenerateImage(imageId, prompt);
      
      // Update local state with the regenerated image
      const updatedImages = images.map(img => 
        img.id === imageId ? response.data : img
      );
      setImages(updatedImages);
      
      // Update the project with the new image
      const updatedStoryboard = {
        ...storyboard,
        images: storyboard.images.map(img => 
          img.id === imageId ? response.data : img
        )
      };
      
      setStoryboard(updatedStoryboard);
      updateProject({
        ...project,
        storyboard: updatedStoryboard
      });
      
    } catch (err) {
      setError('Failed to regenerate image. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };
  
  const handlePromptChange = (imageId, newPrompt) => {
    // Update the prompt locally, but don't save to API until regenerate is clicked
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, prompt: newPrompt } : img
    );
    setImages(updatedImages);
  };
  
  const handleApproveImage = async (imageId, approved) => {
    try {
      // Update local state
      const updatedImages = images.map(img => 
        img.id === imageId ? { ...img, approved } : img
      );
      setImages(updatedImages);
      
      // Update the project
      const updatedStoryboard = {
        ...storyboard,
        images: storyboard.images.map(img => 
          img.id === imageId ? { ...img, approved } : img
        )
      };
      
      setStoryboard(updatedStoryboard);
      updateProject({
        ...project,
        storyboard: updatedStoryboard
      });
      
    } catch (err) {
      setError('Failed to update image approval status.');
      console.error(err);
    }
  };
  
  const handleContinue = () => {
    // Check if all scenes have approved images
    const allScenesHaveApprovedImages = storyboard.scenes.every((_, index) => {
      return images.some(img => img.scene_index === index && img.approved);
    });
    
    if (allScenesHaveApprovedImages) {
      onNext();
    } else {
      setError('Please generate and approve an image for each scene before continuing.');
    }
  };
  
  // Find the image for the active scene
  const activeImage = images.find(img => img.scene_index === activeSceneIndex);
  const activeScene = storyboard.scenes[activeSceneIndex];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Image Generation</h2>
      
      <p className="mb-6 text-gray-600">
        Generate images for each scene in your storyboard. You can edit the prompt and regenerate 
        if you're not satisfied with the result.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scene Selector */}
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-3">Scenes</h3>
          <div className="space-y-2">
            {storyboard.scenes.map((scene, index) => {
              const hasImage = images.some(img => img.scene_index === index);
              const isApproved = images.some(img => img.scene_index === index && img.approved);
              
              return (
                <div 
                  key={index}
                  className={`p-3 rounded-md cursor-pointer ${
                    activeSceneIndex === index 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'bg-white border hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveSceneIndex(index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Scene {index + 1}</span>
                    <span className={`h-3 w-3 rounded-full ${
                      isApproved ? 'bg-green-500' : hasImage ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}></span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {scene.description ? scene.description.substring(0, 40) + '...' : 'No description'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Image Preview and Controls */}
        <div className="md:col-span-2 bg-luxury-cream p-4 rounded-lg border border-luxury-silver/30">
          <h3 className="text-lg font-medium mb-3">Scene {activeSceneIndex + 1}</h3>
          
          {activeScene && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Description:</span> {activeScene.description}
              </p>
              {activeScene.on_screen_text && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">On-screen text:</span> {activeScene.on_screen_text}
                </p>
              )}
            </div>
          )}
          
          {/* Image Display */}
          <div className="mb-4 border rounded-lg overflow-hidden bg-gray-100 p-2">
            {activeImage && activeImage.image_url ? (
              <div className="relative">
                <img 
                  src={activeImage.image_url} 
                  alt={`Scene ${activeSceneIndex + 1}`} 
                  className="w-full h-64 object-contain"
                />
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => handleApproveImage(activeImage.id, !activeImage.approved)}
                    className={`p-2 rounded-full ${
                      activeImage.approved 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-gray-500 border border-gray-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No image generated yet</p>
              </div>
            )}
          </div>
          
          {/* Prompt Editor */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Prompt
            </label>
            <textarea
              rows={3}
              value={activeImage?.prompt || activeScene?.image_prompt || ''}
              onChange={(e) => activeImage 
                ? handlePromptChange(activeImage.id, e.target.value) 
                : null
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end">
            {activeImage ? (
              <button
                type="button"
                onClick={() => handleRegenerateImage(activeImage.id, activeImage.prompt)}
                disabled={generating}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm ${
                  generating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {generating ? 'Generating...' : 'Regenerate Image'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleGenerateImage(activeSceneIndex)}
                disabled={generating}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm ${
                  generating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {generating ? 'Generating...' : 'Generate Image'}
              </button>
            )}
          </div>
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
          onClick={handleContinue}
          disabled={loading}
          className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Continue to Video Creation'}
        </button>
      </div>
    </div>
  );
};

export default ImageGenerationStep;
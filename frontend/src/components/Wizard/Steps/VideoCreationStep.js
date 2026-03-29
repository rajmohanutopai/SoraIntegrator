import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateVideo, regenerateVideo } from '../../../services/api';

const VideoCreationStep = ({ project, onPrev, updateProject }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState(project.videos || []);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoSettings, setVideoSettings] = useState({
    duration: 5,
    transition: 'fade',
    music: 'upbeat',
    resolution: '1080p'
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  // Set selected video if one exists and is marked as selected
  useEffect(() => {
    if (videos.length > 0) {
      const selected = videos.find(video => video.selected);
      if (selected) {
        setSelectedVideo(selected);
      } else {
        setSelectedVideo(videos[0]);
      }
    }
  }, [videos]);
  
  // Ensure we have approved images
  const hasApprovedImages = project.storyboard && 
    project.storyboard.images && 
    project.storyboard.images.some(img => img.approved);
    
  if (!hasApprovedImages) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Please generate and approve images before creating a video.</p>
        <button
          onClick={() => onPrev()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
        >
          Back to Images
        </button>
      </div>
    );
  }
  
  const handleGenerateVideo = async () => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await generateVideo(project.id, videoSettings);
      
      // Add the new video to the list
      const newVideos = [...videos, response.data];
      setVideos(newVideos);
      setSelectedVideo(response.data);
      
      // Update the project
      updateProject({
        ...project,
        videos: newVideos
      });
      
    } catch (err) {
      setError('Failed to generate video. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };
  
  const handleRegenerateVideo = async () => {
    if (!selectedVideo) return;
    
    try {
      setGenerating(true);
      setError(null);
      
      const response = await regenerateVideo(selectedVideo.id, videoSettings);
      
      // Update the video in the list
      const updatedVideos = videos.map(video => 
        video.id === selectedVideo.id ? response.data : video
      );
      
      setVideos(updatedVideos);
      setSelectedVideo(response.data);
      
      // Update the project
      updateProject({
        ...project,
        videos: updatedVideos
      });
      
    } catch (err) {
      setError('Failed to regenerate video. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };
  
  const handleSettingChange = (setting, value) => {
    setVideoSettings({
      ...videoSettings,
      [setting]: value
    });
  };
  
  const handleSelectVideo = (videoId) => {
    const video = videos.find(v => v.id === videoId);
    if (video) {
      setSelectedVideo(video);
    }
  };
  
  const handleFinish = () => {
    // Navigate to the projects list
    navigate('/projects');
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Video Creation</h2>
      
      <p className="mb-6 text-gray-600">
        Generate a video from your approved images. You can adjust settings and create multiple 
        variations until you're satisfied.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Video Settings */}
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Video Settings</h3>
          
          <div className="space-y-4">
            {/* Duration per image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration per image (seconds)
              </label>
              <select
                value={videoSettings.duration}
                onChange={(e) => handleSettingChange('duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={7}>7 seconds</option>
                <option value={10}>10 seconds</option>
              </select>
            </div>
            
            {/* Transition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transition Style
              </label>
              <select
                value={videoSettings.transition}
                onChange={(e) => handleSettingChange('transition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="zoom">Zoom</option>
                <option value="wipe">Wipe</option>
              </select>
            </div>
            
            {/* Background Music */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Music
              </label>
              <select
                value={videoSettings.music}
                onChange={(e) => handleSettingChange('music', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="upbeat">Upbeat</option>
                <option value="relaxed">Relaxed</option>
                <option value="inspiring">Inspiring</option>
                <option value="dramatic">Dramatic</option>
                <option value="none">None</option>
              </select>
            </div>
            
            {/* Resolution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution
              </label>
              <select
                value={videoSettings.resolution}
                onChange={(e) => handleSettingChange('resolution', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="square">Square (1:1)</option>
                <option value="portrait">Portrait (9:16)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Video Preview */}
        <div className="md:col-span-2 bg-luxury-cream p-4 rounded-lg border border-luxury-silver/30">
          <h3 className="text-lg font-medium mb-3">Video Preview</h3>
          
          {selectedVideo ? (
            <div className="mb-4">
              <div className="border rounded-lg overflow-hidden bg-black">
                <video 
                  src={selectedVideo.video_url} 
                  controls
                  className="w-full h-64"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Your Videos</h4>
                <div className="flex overflow-x-auto space-x-2 pb-2">
                  {videos.map((video, index) => (
                    <div 
                      key={video.id}
                      onClick={() => handleSelectVideo(video.id)}
                      className={`flex-shrink-0 cursor-pointer p-2 border rounded ${
                        selectedVideo && selectedVideo.id === video.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                        {/* This would ideally be a thumbnail */}
                        <span className="text-gray-500 text-sm">Video {index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border rounded-lg bg-gray-100">
              <p className="text-gray-500">No video generated yet</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end">
            {videos.length > 0 ? (
              <button
                type="button"
                onClick={handleRegenerateVideo}
                disabled={generating}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm ${
                  generating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {generating ? 'Generating...' : 'Generate New Version'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={generating}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm ${
                  generating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {generating ? 'Generating...' : 'Generate Video'}
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
          onClick={handleFinish}
          disabled={loading || !selectedVideo}
          className={`px-6 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm ${
            loading || !selectedVideo ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
          }`}
        >
          {loading ? 'Saving...' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default VideoCreationStep;
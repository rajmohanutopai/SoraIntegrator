import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../../services/api';
import { Button } from '../UI';

import IdeaInputStep from './Steps/IdeaInputStep';
import IdeaExpansionStep from './Steps/IdeaExpansionStep';
import StoryboardStep from './Steps/StoryboardStep';
import ImageGenerationStep from './Steps/ImageGenerationStep';
import VideoCreationStep from './Steps/VideoCreationStep';

const Wizard = ({ projectId: propProjectId }) => {
  const params = useParams();
  const navigate = useNavigate();
  
  const projectId = propProjectId || params.projectId;
  
  const [activeStep, setActiveStep] = useState(0);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Steps configuration with icons
  const steps = [
    { 
      name: 'Idea Input', 
      component: IdeaInputStep,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Idea Expansion', 
      component: IdeaExpansionStep,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
      )
    },
    { 
      name: 'Storyboard', 
      component: StoryboardStep,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    { 
      name: 'Images', 
      component: ImageGenerationStep,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Video', 
      component: VideoCreationStep,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0, 0 20 20" fill="currentColor">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      )
    },
  ];
  
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const response = await getProject(projectId);
        setProject(response.data);
        
        // Determine the starting step based on project state
        if (response.data.idea && response.data.idea.approved) {
          if (response.data.storyboard && response.data.storyboard.approved) {
            // Check if all images are approved
            const allImagesApproved = response.data.storyboard.images && 
              response.data.storyboard.images.every(img => img.approved);
              
            if (allImagesApproved) {
              setActiveStep(4); // Video step
            } else {
              setActiveStep(3); // Images step
            }
          } else {
            setActiveStep(2); // Storyboard step
          }
        } else if (response.data.idea) {
          setActiveStep(1); // Idea expansion step
        } else {
          setActiveStep(0); // Initial step
        }
        
      } catch (err) {
        setError('Failed to load project');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      loadProject();
    }
  }, [projectId]);
  
  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setActiveStep(stepIndex);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-luxury-midnight">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
        <span className="ml-3 text-lg">Loading your project...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-luxury-burgundy mb-4">{error}</p>
        <Button 
          variant="primary"
          onClick={() => navigate('/projects')}
        >
          Back to projects
        </Button>
      </div>
    );
  }
  
  const StepComponent = steps[activeStep].component;
  
  return (
    <div>
      {/* Steps progress bar */}
      <div className="py-6 px-8 border-b border-gray-100">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`relative flex flex-col items-center ${
                index < activeStep ? 'text-luxury-sage' : 
                index === activeStep ? 'text-luxury-gold' : 'text-luxury-silver'
              }`}
            >
              <div 
                className={`rounded-full h-12 w-12 flex items-center justify-center border-2 ${
                  index < activeStep ? 'border-luxury-sage bg-luxury-sage/10' : 
                  index === activeStep ? 'border-luxury-gold bg-luxury-gold/10' : 'border-luxury-silver/50'
                }`}
              >
                {index < activeStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon || (index + 1)
                )}
              </div>
              <div className="mt-2 text-sm font-medium">{step.name}</div>
            </div>
          ))}
        </div>
        
        {/* Progress lines between steps */}
        <div className="hidden sm:flex justify-between items-center mt-4">
          {steps.map((step, index) => (
            index < steps.length - 1 && (
              <div 
                key={index} 
                className={`h-0.5 w-full ${
                  index < activeStep ? 'bg-luxury-sage' : 'bg-luxury-silver/30'
                }`}
              />
            )
          ))}
        </div>
      </div>
      
      {/* Active step component */}
      <div className="p-8">
        <StepComponent 
          project={project}
          onNext={nextStep}
          onPrev={prevStep}
          onGoToStep={goToStep}
          updateProject={(updatedProject) => setProject(updatedProject)}
        />
      </div>
    </div>
  );
};

export default Wizard;
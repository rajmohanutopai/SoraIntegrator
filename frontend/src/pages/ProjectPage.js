import React from 'react';
import { useParams } from 'react-router-dom';
import Wizard from '../components/Wizard/Wizard';
import { Card } from '../components/UI';

const ProjectPage = () => {
  const { projectId } = useParams();
  
  return (
    <div className="space-y-6">
      <header className="mb-4">
        <h1 className="text-3xl font-display font-bold text-luxury-charcoal">Video Creation Studio</h1>
        <p className="text-luxury-taupe">Follow the steps below to create your professional video</p>
      </header>
      
      <Card variant="elevated" className="overflow-hidden">
        <Wizard projectId={projectId} />
      </Card>
    </div>
  );
};

export default ProjectPage;
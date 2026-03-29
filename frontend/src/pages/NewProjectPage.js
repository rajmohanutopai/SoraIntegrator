import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/api';
import { Button, Card } from '../components/UI';

const NewProjectPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a project title');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await createProject(title);
      navigate(`/projects/${response.data.id}`);
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card variant="elevated" className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-luxury-charcoal mb-2">Create New Video Project</h1>
          <p className="text-luxury-taupe">Enter a title for your new video project</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-luxury-taupe mb-2">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-luxury-cream border border-luxury-silver/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold transition-all"
              placeholder="Video Name"
            />
          </div>
          
          {error && (
            <div className="bg-luxury-burgundy/10 border border-luxury-burgundy/30 text-luxury-burgundy px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3"
              variant={loading ? "secondary" : "primary"}
            >
              {loading ? 'Creating...' : 'Begin Your Creative Journey'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewProjectPage;
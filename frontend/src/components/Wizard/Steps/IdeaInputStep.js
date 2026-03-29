import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { expandIdea } from '../../../services/api';
import { Button } from '../../UI';

const IdeaInputSchema = Yup.object().shape({
  rawIdea: Yup.string()
    .min(10, 'Idea is too short - should be at least 10 characters')
    .required('Please enter your video idea'),
});

const IdeaInputStep = ({ project, onNext, updateProject }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await expandIdea(project.id, values.rawIdea);
      updateProject({
        ...project,
        idea: response.data
      });
      onNext();
    } catch (err) {
      setError('Failed to process your idea. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const initialValues = {
    rawIdea: project.idea?.raw_idea || '',
  };
  
  return (
    <div>
      <h2 className="text-3xl font-display font-bold text-luxury-charcoal mb-4">What's your video idea?</h2>
      
      <p className="mb-6 text-luxury-taupe text-lg">
        Share your vision with us. Be as detailed as possible about the story you want to tell, 
        the emotions you want to evoke, or the information you want to convey. Our AI will help refine and expand your concept.
      </p>
      
      <Formik
        initialValues={initialValues}
        validationSchema={IdeaInputSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form className="space-y-6">
            <div className="bg-luxury-cream p-6 rounded-xl shadow-luxury">
              <label htmlFor="rawIdea" className="block text-luxury-charcoal font-medium mb-3">
                Your Vision
              </label>
              <Field
                as="textarea"
                id="rawIdea"
                name="rawIdea"
                rows={6}
                className="w-full px-4 py-3 bg-luxury-cream border border-luxury-silver/30 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold transition-all"
                placeholder="For example: I want to create a luxury brand video showcasing our new collection of handcrafted jewelry, highlighting the artisanal craftsmanship and the unique story behind each piece."
              />
              <ErrorMessage name="rawIdea" component="div" className="mt-2 text-luxury-burgundy" />
            </div>
            
            {error && (
              <div className="bg-luxury-burgundy/10 border border-luxury-burgundy/30 text-luxury-burgundy px-5 py-4 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !dirty || !isValid || loading}
                variant={loading ? "secondary" : "primary"}
                className={`${(isSubmitting || !dirty || !isValid || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                size="lg"
              >
                {loading ? 'Crafting your vision...' : 'Next Step'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default IdeaInputStep;
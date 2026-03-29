import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Wizard from './Wizard';

// Mock the router params
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    projectId: '1',
  }),
}));

// Mock API service
jest.mock('../../services/api', () => ({
  getProject: jest.fn(() => Promise.resolve({
    data: {
      id: 1,
      title: 'Test Project',
      status: 'in_progress',
    }
  })),
}));

describe('Wizard Component', () => {
  test('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <Wizard />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/loading project/i)).toBeInTheDocument();
  });
  
  // Additional tests would be added for:
  // - Testing step navigation
  // - Testing step components render correctly
  // - Testing error handling
});
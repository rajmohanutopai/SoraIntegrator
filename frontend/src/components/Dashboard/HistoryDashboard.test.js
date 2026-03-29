import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HistoryDashboard from './HistoryDashboard';

// Mock API service
jest.mock('../../services/api', () => ({
  getProjects: jest.fn(() => Promise.resolve({
    data: [
      {
        id: 1,
        title: 'Project 1',
        status: 'in_progress',
        created_at: '2023-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        title: 'Project 2',
        status: 'completed',
        created_at: '2023-01-02T00:00:00.000Z',
      },
    ]
  })),
  deleteProject: jest.fn(() => Promise.resolve({})),
}));

describe('HistoryDashboard Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });
  
  test('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <HistoryDashboard />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/loading your projects/i)).toBeInTheDocument();
  });
  
  test('renders projects when loaded', async () => {
    render(
      <BrowserRouter>
        <HistoryDashboard />
      </BrowserRouter>
    );
    
    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });
  });
  
  // Additional tests would be added for:
  // - Testing search functionality
  // - Testing filtering by status
  // - Testing delete functionality
  // - Testing create new project navigation
});
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import NewProjectPage from './pages/NewProjectPage';
import MainLayout from './components/Layout/MainLayout';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<HomePage />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
            <Route path="/new-project" element={<NewProjectPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
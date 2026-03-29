import React from 'react';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Navigation Header */}
      <nav className="bg-luxury-charcoal px-6 py-4 shadow-luxury">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-luxury-cream text-2xl font-display font-bold">
            VideoAI
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-luxury-cream hover:text-luxury-gold transition-colors">
              Home
            </Link>
            <Link to="/projects" className="text-luxury-cream hover:text-luxury-gold transition-colors">
              Projects
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto py-4 px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-luxury-charcoal text-luxury-pearl py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-display">VideoAI</p>
              <p className="text-sm text-luxury-silver">Transform your ideas into stunning videos</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/about" className="text-sm hover:text-luxury-gold transition-colors">
                About
              </Link>
              <Link to="/privacy" className="text-sm hover:text-luxury-gold transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm hover:text-luxury-gold transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
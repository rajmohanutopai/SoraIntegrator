import React from 'react';
import { Link } from 'react-router-dom';
import HistoryDashboard from '../components/Dashboard/HistoryDashboard';
import { Button, Card } from '../components/UI';

const HomePage = () => {
  return (
    <div className="space-y-4">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-luxury-taupe to-luxury-charcoal text-luxury-cream rounded-2xl p-5 md:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Create Beautiful Videos
          </h1>
        </div>
      </section>

      {/* Dashboard section */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-display font-semibold text-luxury-charcoal">Your Projects</h2>
          <Link to="/new-project">
            <Button variant="primary" size="sm">Create a Video</Button>
          </Link>
        </div>
        <Card variant="elevated" className="overflow-visible">
          <Card.Body className="p-4">
            <HistoryDashboard />
          </Card.Body>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
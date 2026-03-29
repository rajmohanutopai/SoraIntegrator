import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This contains Tailwind directives
import './styles.css'; // Generated CSS from Tailwind
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
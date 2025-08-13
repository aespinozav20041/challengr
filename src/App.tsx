import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { Router } from './components/Router';
import { Navigation } from './components/Navigation';
import { Toaster } from './components/Toaster';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Router />
        <Navigation />
        <Toaster />
      </div>
    </AppProvider>
  );
}

export default App;
import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Home } from '../pages/Home';
import { CreateChallenge } from '../pages/CreateChallenge';
import { Profile } from '../pages/Profile';
import { Wallet } from '../pages/Wallet';
import { Challenge } from '../pages/Challenge';
import { AuthScreen } from '../pages/AuthScreen';

export const Router: React.FC = () => {
  const { user, currentView } = useApp();

  if (!user) {
    return <AuthScreen />;
  }

  switch (currentView) {
    case 'home':
      return <Home />;
    case 'create':
      return <CreateChallenge />;
    case 'profile':
      return <Profile />;
    case 'wallet':
      return <Wallet />;
    default:
      if (currentView.startsWith('challenge/')) {
        const challengeId = currentView.split('/')[1];
        return <Challenge challengeId={challengeId} />;
      }
      return <Home />;
  }
};
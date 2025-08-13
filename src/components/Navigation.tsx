import React from 'react';
import { Home, Plus, User, Wallet } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const Navigation: React.FC = () => {
  const { user, currentView, setCurrentView } = useApp();

  if (!user) return null;

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'create', icon: Plus, label: 'Create' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-orange-500 bg-orange-50'
                  : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
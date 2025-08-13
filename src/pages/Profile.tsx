import React from 'react';
import { Edit, Trophy, TrendingUp, Users, Calendar, Star, Settings, LogOut, Badge } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';

export const Profile: React.FC = () => {
  const { user, logout, challenges } = useApp();
  
  if (!user) return null;

  const userChallenges = challenges.filter(c => c.hostId === user.id);
  const achievements = [
    { icon: Trophy, label: 'First Win', description: 'Won your first challenge', unlocked: user.stats.challengesWon > 0 },
    { icon: Star, label: 'Content Creator', description: 'Created 5 challenges', unlocked: user.stats.challengesCreated >= 5 },
    { icon: Users, label: 'Community Favorite', description: 'Received 100 total votes', unlocked: user.stats.totalVotes >= 100 },
    { icon: TrendingUp, label: 'High Roller', description: 'Earned $100+ total', unlocked: user.stats.totalEarnings >= 100 },
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-18 h-18 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user.displayName}</h1>
              <p className="text-purple-100 mb-2">{user.email}</p>
              <div className="flex items-center gap-2">
                <Badge className="text-yellow-300" size={16} />
                <span className="text-sm">Level {Math.floor(user.reputation / 100) + 1}</span>
              </div>
            </div>
            <button className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              <Edit size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <Trophy className="mx-auto mb-2 text-yellow-300" size={24} />
              <p className="text-xl font-bold">{user.stats.challengesWon}</p>
              <p className="text-xs text-purple-100">Wins</p>
            </div>
            <div className="text-center">
              <TrendingUp className="mx-auto mb-2 text-green-300" size={24} />
              <p className="text-xl font-bold">{formatCurrency(user.stats.totalEarnings)}</p>
              <p className="text-xs text-purple-100">Earned</p>
            </div>
            <div className="text-center">
              <Users className="mx-auto mb-2 text-blue-300" size={24} />
              <p className="text-xl font-bold">{user.stats.challengesCreated}</p>
              <p className="text-xs text-purple-100">Created</p>
            </div>
            <div className="text-center">
              <Star className="mx-auto mb-2 text-orange-300" size={24} />
              <p className="text-xl font-bold">{user.stats.winRate}%</p>
              <p className="text-xs text-purple-100">Win Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <Icon
                    className={`mb-2 ${
                      achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                    size={24}
                  />
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {achievement.label}
                  </h4>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                  {achievement.unlocked && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                        Unlocked!
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-500" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Member Since</p>
                  <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Star className="text-orange-500" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Reputation Score</p>
                  <p className="text-sm text-gray-600">{user.reputation} points</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="text-green-500" size={20} />
                <div>
                  <p className="font-semibold text-gray-900">Daily Votes</p>
                  <p className="text-sm text-gray-600">
                    {user.maxVotesPerDay - user.votesUsedToday} of {user.maxVotesPerDay} remaining
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="text-gray-500" size={20} />
                <span className="font-medium text-gray-900">Account Settings</span>
              </div>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <Badge className="text-gray-500" size={20} />
                <span className="font-medium text-gray-900">Privacy & Security</span>
              </div>
            </button>
            
            <button
              onClick={logout}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-xl transition-colors text-red-600"
            >
              <div className="flex items-center gap-3">
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </div>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-gray-500">
          <p className="text-sm mb-2">LaughBattle v1.0.0</p>
          <p className="text-xs">Made with ❤️ for comedy creators</p>
        </div>
      </div>
    </div>
  );
};
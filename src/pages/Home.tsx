import React, { useState } from 'react';
import { Search, Filter, Flame, Clock, Users } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ChallengeCard } from '../components/ChallengeCard';
import { Challenge } from '../types';

export const Home: React.FC = () => {
  const { challenges, user, getRemainingVotes } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('trending');

  const categories = ['All', 'Comedy', 'Impressions', 'Dance', 'Music', 'Acting', 'Physical'];

  const filteredChallenges = challenges
    .filter(challenge => {
      const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || challenge.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'prize':
          return b.pool.gross - a.pool.gross;
        case 'ending':
          return a.timeline.votingEnd - b.timeline.votingEnd;
        default: // trending
          return b.entries - a.entries;
      }
    });

  const remainingVotes = getRemainingVotes();

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hey, {user?.displayName}! 👋
              </h1>
              <p className="text-gray-600">Ready to laugh and compete?</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Daily votes</p>
              <p className="text-lg font-bold text-orange-500">
                {remainingVotes} left
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Filter size={18} className="text-gray-500" />
          <div className="flex gap-3 overflow-x-auto">
            {[
              { id: 'trending', label: 'Trending', icon: Flame },
              { id: 'newest', label: 'Newest', icon: Clock },
              { id: 'prize', label: 'Highest Prize', icon: null },
              { id: 'ending', label: 'Ending Soon', icon: Users }
            ].map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 ${
                    sortBy === option.id
                      ? 'bg-orange-100 text-orange-600 border border-orange-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Challenges */}
      <div className="px-4 py-4">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No challenges found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
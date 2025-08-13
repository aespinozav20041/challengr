import React, { useState } from 'react';
import { Heart, SkipBack as Skip, Info } from 'lucide-react';
import { Entry } from '../types';
import { useApp } from '../contexts/AppContext';

interface VotingInterfaceProps {
  challengeId: string;
  entries: Entry[];
}

export const VotingInterface: React.FC<VotingInterfaceProps> = ({ challengeId, entries }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { castVote, getRemainingVotes, votes, user } = useApp();
  
  if (entries.length === 0) {
    return (
      <div className="p-4 text-center py-12">
        <div className="text-6xl mb-4">🎭</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No entries to vote on yet
        </h3>
        <p className="text-gray-600">
          Check back when participants start submitting their entries!
        </p>
      </div>
    );
  }

  const currentEntry = entries[currentIndex];
  const remainingVotes = getRemainingVotes();
  const hasVotedForCurrent = votes.some(v => v.voterId === user?.id && v.entryId === currentEntry.id);

  const handleVote = () => {
    if (castVote(currentEntry.id)) {
      // Move to next entry after voting
      handleNext();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % entries.length);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Voting Progress */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Votes Remaining</span>
          <span className="font-bold text-orange-500">{remainingVotes}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((user?.maxVotesPerDay || 20) - remainingVotes) / (user?.maxVotesPerDay || 20) * 100}%` }}
          />
        </div>
      </div>

      {/* Entry Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Video/Image */}
        <div className="aspect-[3/4] bg-gray-900 relative">
          <img
            src={currentEntry.thumbURL}
            alt="Entry"
            className="w-full h-full object-cover"
          />
          
          {/* Entry Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {currentEntry.userName.charAt(0)}
                </span>
              </div>
              <span className="text-white font-semibold">{currentEntry.userName}</span>
            </div>
            <p className="text-white text-sm line-clamp-2">
              {currentEntry.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Heart className="text-red-400" size={16} />
              <span className="text-white text-sm">{currentEntry.votesCount} votes</span>
            </div>
          </div>

          {/* Entry Counter */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-sm font-medium">
              {currentIndex + 1} / {entries.length}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6">
          {hasVotedForCurrent ? (
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                <Heart className="fill-current" size={16} />
                <span className="text-sm font-medium">Already voted!</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={handleNext}
                disabled={remainingVotes <= 0}
                className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                <Skip size={20} />
                <span className="font-medium">Skip</span>
              </button>
              
              <button
                onClick={handleVote}
                disabled={remainingVotes <= 0}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart size={20} />
                <span>Vote</span>
              </button>
            </div>
          )}

          {/* Info */}
          <div className="flex items-center gap-2 text-center justify-center text-gray-500">
            <Info size={16} />
            <span className="text-sm">
              {remainingVotes > 0 
                ? `${remainingVotes} votes left today`
                : 'No votes remaining today'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Calendar, Users, DollarSign, Timer, Trophy, Eye } from 'lucide-react';
import { Challenge } from '../types';
import { useApp } from '../contexts/AppContext';
import { formatTimeRemaining, formatCurrency } from '../utils/formatters';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const { setCurrentView } = useApp();

  const getStatusInfo = () => {
    const now = Date.now();
    
    if (challenge.status === 'signup') {
      return {
        status: 'Open for Entry',
        color: 'bg-green-500',
        timeLeft: formatTimeRemaining(challenge.timeline.submitDeadline),
        action: 'Join Challenge'
      };
    } else if (challenge.status === 'submission') {
      return {
        status: 'Submission Phase',
        color: 'bg-blue-500',
        timeLeft: formatTimeRemaining(challenge.timeline.submitDeadline),
        action: 'Submit Entry'
      };
    } else if (challenge.status === 'voting') {
      return {
        status: 'Voting Open',
        color: 'bg-orange-500',
        timeLeft: formatTimeRemaining(challenge.timeline.votingEnd),
        action: 'Vote Now'
      };
    } else {
      return {
        status: 'Completed',
        color: 'bg-gray-500',
        timeLeft: 'Ended',
        action: 'View Results'
      };
    }
  };

  const statusInfo = getStatusInfo();

  const handleClick = () => {
    setCurrentView(`challenge/${challenge.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
              {challenge.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {challenge.description}
            </p>
          </div>
          <div className="ml-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}>
              {statusInfo.status}
            </span>
          </div>
        </div>

        {/* Host Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {challenge.hostName.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-gray-600">by {challenge.hostName}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600">
            {challenge.category}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-500" size={16} />
            <div>
              <p className="text-xs text-gray-600">Prize Pool</p>
              <p className="font-bold text-green-600">
                {formatCurrency(challenge.pool.gross)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="text-blue-500" size={16} />
            <div>
              <p className="text-xs text-gray-600">Participants</p>
              <p className="font-bold text-blue-600">
                {challenge.entries}{challenge.maxParticipants !== Infinity ? `/${challenge.maxParticipants}` : ''}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-2">
          <Timer className="text-orange-500" size={16} />
          <div>
            <p className="text-xs text-gray-600">Time Left</p>
            <p className="font-bold text-orange-600">{statusInfo.timeLeft}</p>
          </div>
        </div>
      </div>

      {/* Entry Fee & Action */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Entry Fee:</span>
            <span className="font-bold text-gray-900">
              {formatCurrency(challenge.entryFee)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-orange-600">
            <span className="text-sm font-medium">{statusInfo.action}</span>
            <Eye size={16} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {challenge.maxParticipants !== Infinity && (
        <div className="px-4 pb-3">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((challenge.entries / challenge.maxParticipants) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
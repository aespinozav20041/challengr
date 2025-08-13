import React, { useState } from 'react';
import { ArrowLeft, Users, DollarSign, Clock, Heart, Share2, Flag, Video, Upload } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { formatTimeRemaining, formatCurrency } from '../utils/formatters';
import { VotingInterface } from '../components/VotingInterface';
import { UploadModal } from '../components/UploadModal';

interface ChallengeProps {
  challengeId: string;
}

export const Challenge: React.FC<ChallengeProps> = ({ challengeId }) => {
  const { challenges, entries, setCurrentView, user, joinChallenge } = useApp();
  const [activeTab, setActiveTab] = useState('entries');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const challenge = challenges.find(c => c.id === challengeId);
  const challengeEntries = entries.filter(e => e.challengeId === challengeId);
  
  if (!challenge) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Challenge not found</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="text-orange-500 hover:text-orange-600"
        >
          Go back to home
        </button>
      </div>
    );
  }

  const handleJoinChallenge = async () => {
    if (challenge.status === 'signup') {
      const success = await joinChallenge(challengeId);
      if (success) {
        setShowUploadModal(true);
      }
    } else if (challenge.status === 'submission') {
      setShowUploadModal(true);
    }
  };

  const getActionButton = () => {
    if (challenge.status === 'signup') {
      return (
        <button
          onClick={handleJoinChallenge}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Join Challenge - {formatCurrency(challenge.entryFee)}
        </button>
      );
    } else if (challenge.status === 'submission') {
      return (
        <button
          onClick={handleJoinChallenge}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Submit Entry
        </button>
      );
    } else if (challenge.status === 'voting') {
      return (
        <button
          onClick={() => setActiveTab('vote')}
          className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Vote Now
        </button>
      );
    }
    return null;
  };

  const tabs = [
    { id: 'entries', label: 'Entries', count: challengeEntries.length },
    { id: 'vote', label: 'Vote', count: null },
    { id: 'rules', label: 'Rules', count: null },
    { id: 'prizes', label: 'Prizes', count: null },
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-xl text-gray-900 line-clamp-2">
                {challenge.title}
              </h1>
              <p className="text-sm text-gray-600">by {challenge.hostName}</p>
            </div>
          </div>

          {/* Status & Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <DollarSign className="text-green-500 mx-auto mb-1" size={20} />
              <p className="text-xs text-gray-600">Prize Pool</p>
              <p className="font-bold text-green-600">{formatCurrency(challenge.pool.gross)}</p>
            </div>
            <div className="text-center">
              <Users className="text-blue-500 mx-auto mb-1" size={20} />
              <p className="text-xs text-gray-600">Participants</p>
              <p className="font-bold text-blue-600">{challenge.entries}</p>
            </div>
            <div className="text-center">
              <Clock className="text-orange-500 mx-auto mb-1" size={20} />
              <p className="text-xs text-gray-600">Time Left</p>
              <p className="font-bold text-orange-600">
                {formatTimeRemaining(challenge.timeline.votingEnd)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {getActionButton()}
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Share2 size={20} className="text-gray-600" />
            </button>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Flag size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-100">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'entries' && (
          <div className="p-4">
            {challengeEntries.length === 0 ? (
              <div className="text-center py-12">
                <Video className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No entries yet
                </h3>
                <p className="text-gray-600">
                  Be the first to submit your entry!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {challengeEntries.map(entry => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="aspect-video bg-gray-900 relative">
                      <img
                        src={entry.thumbURL}
                        alt="Entry thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Heart className="text-white" size={16} />
                        <span className="text-white text-sm font-medium">
                          {entry.votesCount}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {entry.userName}
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {entry.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vote' && challenge.status === 'voting' && (
          <VotingInterface challengeId={challengeId} entries={challengeEntries} />
        )}

        {activeTab === 'rules' && (
          <div className="p-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Challenge Rules</h3>
              <div className="space-y-3">
                {challenge.rules.map((rule, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{rule}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Entries must be original content</li>
                  <li>• No offensive or inappropriate content</li>
                  <li>• Maximum video length: 60 seconds</li>
                  <li>• Decisions are final after voting closes</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prizes' && (
          <div className="p-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Prize Distribution</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🥇</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">1st Place</h4>
                        <p className="text-sm text-gray-600">Winner takes the majority</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-yellow-600">
                        {formatCurrency(challenge.pool.net * 0.7)}
                      </p>
                      <p className="text-sm text-gray-600">70%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border-l-4 border-gray-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🥈</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">2nd Place</h4>
                        <p className="text-sm text-gray-600">Runner-up prize</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-600">
                        {formatCurrency(challenge.pool.net * 0.15)}
                      </p>
                      <p className="text-sm text-gray-600">15%</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🥉</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">3rd Place</h4>
                        <p className="text-sm text-gray-600">Bronze medal prize</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-600">
                        {formatCurrency(challenge.pool.net * 0.08)}
                      </p>
                      <p className="text-sm text-gray-600">8%</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Platform Commission (7%)</span>
                    <span>{formatCurrency(challenge.pool.commission)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
                    <span>Total Pool</span>
                    <span>{formatCurrency(challenge.pool.gross)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          challengeId={challengeId}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};
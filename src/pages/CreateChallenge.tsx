import React, { useState } from 'react';
import { Calendar, DollarSign, Users, Clock, FileText, Tag } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const CreateChallenge: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Comedy',
    entryFee: 2,
    maxParticipants: 20,
    rules: ['Keep it family friendly', 'Original content only', 'Maximum 60 seconds'],
    tags: [] as string[],
  });
  
  const [newRule, setNewRule] = useState('');
  const [newTag, setNewTag] = useState('');
  const { createChallenge, setCurrentView } = useApp();

  const categories = ['Comedy', 'Impressions', 'Dance', 'Music', 'Acting', 'Physical', 'Lip Sync'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate timeline (for demo, using simplified dates)
    const now = Date.now();
    const timeline = {
      signupStart: now,
      submitDeadline: now + (2 * 24 * 60 * 60 * 1000), // 2 days
      votingStart: now + (2 * 24 * 60 * 60 * 1000),
      votingEnd: now + (4 * 24 * 60 * 60 * 1000), // 4 days total
    };

    const challengeId = createChallenge({
      ...formData,
      hostId: 'current_user',
      hostName: 'You',
      status: 'signup',
      timeline,
    });

    // Navigate to the created challenge
    setCurrentView(`challenge/${challengeId}`);
  };

  const addRule = () => {
    if (newRule.trim() && !formData.rules.includes(newRule.trim())) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Challenge</h1>
          <p className="text-gray-600">Set up a new humor challenge for the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenge Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Best Dad Joke Challenge"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what participants should do..."
                rows={3}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Challenge Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Challenge Settings</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Fee ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.entryFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryFee: parseFloat(e.target.value) }))}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Participants
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="number"
                  min="2"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Estimated Prize Pool</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-green-700">Total Pool</p>
                <p className="font-bold text-green-800">
                  ${(formData.entryFee * formData.maxParticipants).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-green-700">Winner (70%)</p>
                <p className="font-bold text-green-800">
                  ${(formData.entryFee * formData.maxParticipants * 0.7).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-green-700">Commission (7%)</p>
                <p className="font-bold text-green-800">
                  ${(formData.entryFee * formData.maxParticipants * 0.07).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Challenge Rules</h2>
          
          <div className="space-y-3 mb-4">
            {formData.rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="flex-1 text-gray-700">{rule}</span>
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Add a new rule..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
            />
            <button
              type="button"
              onClick={addRule}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags (Optional)</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
              >
                <Tag size={14} />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-orange-500 hover:text-orange-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              disabled={formData.tags.length >= 5}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tags help people discover your challenge. Maximum 5 tags.
          </p>
        </div>

        {/* Submit */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Create Challenge
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            By creating this challenge, you agree to our terms and community guidelines.
          </p>
        </div>
      </form>
    </div>
  );
};
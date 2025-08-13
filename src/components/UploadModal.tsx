import React, { useState } from 'react';
import { X, Upload, Camera, File, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface UploadModalProps {
  challengeId: string;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ challengeId, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const { submitEntry, challenges } = useApp();

  const challenge = challenges.find(c => c.id === challengeId);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 50MB for demo)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
        alert('Please select a video or image file');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !description.trim()) {
      alert('Please select a file and add a description');
      return;
    }

    setUploading(true);
    
    try {
      const success = await submitEntry(challengeId, selectedFile, description);
      if (success) {
        onClose();
      }
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Submit Entry</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Challenge Info */}
          {challenge && (
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{challenge.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
              <div className="flex items-center gap-2 text-orange-600">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">Review the rules before submitting</span>
              </div>
            </div>
          )}

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Video/Image
            </label>
            
            {!selectedFile ? (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all duration-200">
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">Videos and images up to 50MB</p>
              </label>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    {selectedFile.type.startsWith('video/') ? (
                      <Camera className="text-orange-600" size={20} />
                    ) : (
                      <File className="text-orange-600" size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your entry..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/280 characters
            </p>
          </div>

          {/* Rules Reminder */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Quick Rules:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Keep it family-friendly</li>
              <li>• Original content only</li>
              <li>• Maximum 60 seconds for videos</li>
              <li>• Follow challenge-specific rules</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || !description.trim() || uploading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
            >
              {uploading ? 'Uploading...' : 'Submit Entry'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
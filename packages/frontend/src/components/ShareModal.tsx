import { useState } from 'react';
import { X, Copy, Check, QrCode, Twitter, Linkedin, MessageCircle, Lock, Globe, Eye } from 'lucide-react';
import { nanoid } from 'nanoid';
import { API_URL } from '../config';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: any;
}

export default function ShareModal({ isOpen, onClose, projectData }: ShareModalProps) {
  const [shareId] = useState(() => nanoid(10));
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('unlisted');
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareComplete, setShareComplete] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/share/${shareId}`;

  const saveProject = async () => {
    setIsSharing(true);
    try {
      const response = await fetch(`${API_URL}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareId,
          projectData: {
            ...projectData,
            visibility,
            password: visibility === 'private' ? password : null,
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShareComplete(true);
        // Store share ID in localStorage for auto-sync
        localStorage.setItem('currentShareId', shareId);
      }
    } catch (error) {
      console.error('Failed to share:', error);
      alert('Failed to share project. Make sure the server is running.');
    } finally {
      setIsSharing(false);
    }
  };

  const syncProject = async () => {
    setIsSharing(true);
    try {
      const response = await fetch(`${API_URL}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareId,
          projectData: {
            ...projectData,
            visibility,
            password: visibility === 'private' ? password : null,
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('✓ Project synced successfully!');
      }
    } catch (error) {
      console.error('Failed to sync:', error);
      alert('Failed to sync project.');
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareComplete) {
      await saveProject();
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToSocial = (platform: string) => {
    const text = 'Check out my React Native project!';
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      discord: shareUrl, // Copy for Discord
    };

    if (platform === 'discord') {
      copyToClipboard();
    } else {
      window.open(urls[platform as keyof typeof urls], '_blank');
    }
  };

  const getEmbedCode = () => {
    return `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Share Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Share Link */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">🔗 Share Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div>
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <QrCode className="w-5 h-5" />
              {showQR ? 'Hide QR Code' : 'Show QR Code for Mobile'}
            </button>
            {showQR && (
              <div className="mt-3 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                <div className="text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`}
                    alt="QR Code"
                    className="w-64 h-64 mx-auto bg-white p-3 rounded-lg shadow-lg"
                  />
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-800">📱 Scan with your phone</p>
                    <p className="text-xs text-gray-600">Opens in fullscreen preview mode</p>
                    <p className="text-xs text-gray-500">Perfect for testing on real devices!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visibility */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">🌐 Visibility</label>
            <div className="flex gap-2">
              <button
                onClick={() => setVisibility('public')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  visibility === 'public'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Globe className="w-4 h-4 mx-auto mb-1" />
                Public
              </button>
              <button
                onClick={() => setVisibility('unlisted')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  visibility === 'unlisted'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Eye className="w-4 h-4 mx-auto mb-1" />
                Unlisted
              </button>
              <button
                onClick={() => setVisibility('private')}
                className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                  visibility === 'private'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Lock className="w-4 h-4 mx-auto mb-1" />
                Private
              </button>
            </div>
          </div>

          {/* Password Protection */}
          {visibility === 'private' && (
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">🔒 Password Protection</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Optional password"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
              />
            </div>
          )}

          {/* Social Sharing */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">📱 Share to Social</label>
            <div className="flex gap-2">
              <button
                onClick={() => shareToSocial('twitter')}
                className="flex-1 px-3 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              <button
                onClick={() => shareToSocial('linkedin')}
                className="flex-1 px-3 py-2 bg-[#0A66C2] hover:bg-[#095196] text-white rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
              <button
                onClick={() => shareToSocial('discord')}
                className="flex-1 px-3 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded text-sm transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Discord
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">💻 Embed Code</label>
            <div className="bg-gray-900 p-3 rounded text-xs font-mono text-gray-300 overflow-x-auto">
              {getEmbedCode()}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(getEmbedCode());
              }}
              className="mt-2 text-sm text-blue-400 hover:text-blue-300"
            >
              Copy embed code
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-700">
          {shareComplete && (
            <div className="text-sm text-green-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Project shared successfully!
            </div>
          )}
          {!shareComplete && (
            <div className="text-sm text-gray-400">
              Click "Save & Share" to create share link
            </div>
          )}
          <div className="flex gap-2">
            {!shareComplete ? (
              <button
                onClick={saveProject}
                disabled={isSharing}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
              >
                {isSharing ? 'Saving...' : 'Save & Share'}
              </button>
            ) : (
              <button
                onClick={syncProject}
                disabled={isSharing}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSharing ? 'Syncing...' : (
                  <>
                    <Check className="w-4 h-4" />
                    Sync Changes
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

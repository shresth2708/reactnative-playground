import { useState } from 'react';
import { Play, Share2, Download, Settings, User, Save } from 'lucide-react';
import { usePlaygroundStore } from '../store/playgroundStore';

import { useAuthStore } from '../store/authStore';
import { API_URL } from '../config';
import ShareModal from './ShareModal';
import DownloadModal from './DownloadModal';
import SettingsModal from './SettingsModal';
import ScreenRecorder from './ScreenRecorder';

export default function Header() {
  const { isConnected, files, openTabs } = usePlaygroundStore();

  const { isAuthenticated, user, token } = useAuthStore();
  const [showShare, setShowShare] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const currentShareId = localStorage.getItem('currentShareId');

  const savePlayground = async () => {
    if (!isAuthenticated || !token) {
      alert('Please sign in to save playgrounds');
      return;
    }

    const name = prompt('Enter playground name:', 'My Playground');
    if (!name) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/playgrounds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, files }),
      });
      const data = await response.json();
      if (data.success) {
        setTimeout(() => setIsSaving(false), 1500);
      } else {
        alert('Failed to save: ' + data.error);
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save playground');
      setIsSaving(false);
    }
  };

  const quickSync = async () => {
    if (!currentShareId) return;
    setIsSyncing(true);
    try {
      const response = await fetch(`${API_URL}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shareId: currentShareId,
          projectData: { files, openTabs },
        }),
      });
      const data = await response.json();
      if (data.success) {
        // Show success briefly
        setTimeout(() => setIsSyncing(false), 1000);
      }
    } catch (error) {
      console.error('Failed to sync:', error);
      setIsSyncing(false);
    }
  };



  return (
    <>
      <header className="h-16 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6 relative overflow-hidden">
        {/* Subtle animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-lime-500/5 via-green-500/5 to-emerald-500/5 animate-pulse-slow"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-lime-500 to-green-400 rounded-xl flex items-center justify-center shadow-glow-green animate-glow">
              <Play className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text-green">RN Playground</h1>
              <div className="text-xs text-gray-400 font-medium">Real-time Collaboration</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-lime-400 animate-pulse' : 'bg-red-500'} shadow-lg`} />
            <span className={`text-xs font-medium ${isConnected ? 'text-lime-400' : 'text-red-400'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <ScreenRecorder />
          
          {isAuthenticated && (
            <button
              onClick={savePlayground}
              disabled={isSaving}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 ${
                isSaving 
                  ? 'bg-lime-500/20 text-lime-400 shadow-lg shadow-lime-500/20 animate-pulse' 
                  : 'bg-slate-700/50 hover:bg-lime-500/20 text-slate-300 hover:text-lime-400 hover:shadow-lg hover:shadow-lime-500/10 hover:scale-105'
              }`}
              title="Save to your account"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saved!' : 'Save'}
            </button>
          )}
          
          {currentShareId && (
            <button
              onClick={quickSync}
              disabled={isSyncing}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 ${
                isSyncing 
                  ? 'bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20 animate-pulse' 
                  : 'bg-slate-700/50 hover:bg-green-500/20 text-slate-300 hover:text-green-400 hover:shadow-lg hover:shadow-green-500/10 hover:scale-105'
              }`}
              title="Sync shared project"
            >
              <Share2 className="w-4 h-4" />
              {isSyncing ? '✓ Synced' : 'Sync'}
            </button>
          )}
          
          <button
            onClick={() => setShowShare(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-500 hover:to-lime-500 text-black rounded-xl flex items-center gap-2 font-medium transition-all duration-300 hover:scale-105 hover:shadow-glow-green shadow-lg"
            title="Share Project"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>

          <button
            onClick={() => setShowDownload(true)}
            className="p-3 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-slate-100 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
            title="Download Project"
          >
            <Download className="w-5 h-5" />
          </button>



          <button
            onClick={() => setShowSettings(true)}
            className="p-3 glass hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {isAuthenticated ? (
            <a
              href="/profile"
              className="p-3 glass hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg flex items-center gap-2"
              title={`Profile - ${user?.name}`}
            >
              <User className="w-5 h-5" />
            </a>
          ) : (
            <a
              href="/signin"
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-500 hover:to-lime-500 text-black rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-glow-green shadow-lg"
            >
              Sign In
            </a>
          )}
        </div>
      </header>

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        projectData={{ files, openTabs }}
      />

      <DownloadModal
        isOpen={showDownload}
        onClose={() => setShowDownload(false)}
        projectData={{ files, openTabs }}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}

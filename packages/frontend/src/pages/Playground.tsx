import { useEffect } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import { API_URL } from '../config';
import Header from '../components/Header';
import Editor from '../components/Editor';
import Preview from '../components/Preview';
import Console from '../components/Console';
import Sidebar from '../components/Sidebar';
import AIChat from '../components/AIChat';
import Notifications from '../components/Notifications';
import CollaborationPanel from '../components/CollaborationPanel';
import LivePresence from '../components/LivePresence';
import CursorPresence from '../components/CursorPresence';
import FileLock from '../components/FileLock';

function Playground() {
  const { connect, isConnected, socket } = usePlaygroundStore();

  // Detect if mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isShareURL = window.location.pathname.startsWith('/share/');
  const showMobilePreview = isMobile && isShareURL;

  useEffect(() => {
    connect();
  }, [connect]);

  // Auto-load shared project (but don't auto-join - let user join manually)
  useEffect(() => {
    const loadSharedProject = async () => {
      const path = window.location.pathname;
      const match = path.match(/^\/share\/([a-zA-Z0-9_-]+)$/);
      
      if (match && socket) {
        const shareId = match[1];
        console.log('Loading shared project:', shareId);
        try {
          const response = await fetch(`${API_URL}/api/share/${shareId}`);
          const data = await response.json();
          
          console.log('Loaded project data:', data);
          
          if (data.success && data.project) {
            // Load project files into the store
            const store = usePlaygroundStore.getState();
            
            if (data.project.files && Array.isArray(data.project.files)) {
              console.log('Setting files:', data.project.files.length, 'files');
              // Use the store's setter to properly update files
              usePlaygroundStore.setState({ files: data.project.files });
              
              // Open the first file if available
              const firstFile = data.project.files.find((f: any) => f.type === 'file');
              if (firstFile) {
                store.openFile(firstFile.id);
              }
            }
            
            // Store the share ID for auto-sync
            localStorage.setItem('currentShareId', shareId);
            console.log('✓ Shared project loaded successfully');
          } else {
            console.error('No project data found');
          }
        } catch (error) {
          console.error('Failed to load shared project:', error);
        }
      }
    };

    if (socket?.connected) {
      loadSharedProject();
    }
  }, [socket]);

  // Mobile fullscreen preview mode
  if (showMobilePreview) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
        <div className="h-14 glass-dark border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 via-lime-500 to-green-400 rounded-lg flex items-center justify-center shadow-glow-green">
              <span className="text-white text-sm font-bold">▶</span>
            </div>
            <div>
              <span className="text-white text-lg font-bold">Live Preview</span>
              <div className="text-xs text-gray-400">Mobile View</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-lime-500 animate-pulse' : 'bg-red-500'} shadow-lg`} />
            <span className={`text-xs font-medium ${isConnected ? 'text-lime-400' : 'text-red-400'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Preview />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.05),transparent_50%)] animate-pulse-slow"></div>
      </div>
      
      <Header />
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar />
        <div className="flex-1 flex border-t border-slate-700/30">
          <Editor />
          <Preview />
        </div>
      </div>
      <Console />
      <AIChat />
      <CollaborationPanel />
      <LivePresence />
      <CursorPresence />
      <FileLock />
      <Notifications />
      {!isConnected && (
        <div className="fixed top-20 right-6 bg-slate-800/95 backdrop-blur-lg border border-amber-500/30 text-amber-200 px-5 py-3 rounded-xl shadow-2xl z-50 animate-pulse font-medium">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Connecting to server...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Playground;

import { FileCode, Package, BookOpen, Layers } from 'lucide-react';
import { useState } from 'react';
import FileTree from './FileTree';
import { usePlaygroundStore } from '../store/playgroundStore';
import { counterTemplate } from '../templates/counter';
import { todoTemplate } from '../templates/todo';
import { animationTemplate } from '../templates/animation';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<'files' | 'packages' | 'templates' | 'examples'>('files');
  const { updateFileContent, openFile, files } = usePlaygroundStore();

  const loadTemplate = (_name: string, content: string) => {
    // Find or create App.tsx
    const findAppFile = (nodes: any[]): any => {
      for (const node of nodes) {
        if (node.name === 'App.tsx' && node.type === 'file') return node;
        if (node.children) {
          const found = findAppFile(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const appFile = findAppFile(files);
    if (appFile) {
      updateFileContent(appFile.id, content);
      openFile(appFile.id);
    }
  };

  return (
    <div className="w-72 bg-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 flex flex-col relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-800 to-slate-900"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-lime-500/3 via-transparent to-green-500/3 animate-pulse-slow"></div>
      
      <div className="flex border-b border-white/10 relative z-10">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 relative ${
            activeTab === 'files' 
              ? 'text-lime-400 bg-lime-500/10 border-b-2 border-lime-400' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
          }`}
          title="Files"
        >
          <FileCode className="w-5 h-5" />
          <span className="text-xs font-semibold">Files</span>
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex-1 p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 relative ${
            activeTab === 'packages' 
              ? 'text-lime-400 bg-lime-500/10 border-b-2 border-lime-400' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
          }`}
          title="Packages"
        >
          <Package className="w-5 h-5" />
          <span className="text-xs font-semibold">Packages</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 relative ${
            activeTab === 'templates' 
              ? 'text-lime-400 bg-lime-500/10 border-b-2 border-lime-400' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
          }`}
          title="Templates"
        >
          <Layers className="w-5 h-5" />
          <span className="text-xs font-semibold">Templates</span>
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`flex-1 p-4 flex flex-col items-center justify-center gap-2 transition-all duration-200 relative ${
            activeTab === 'examples' 
              ? 'text-lime-400 bg-lime-500/10 border-b-2 border-lime-400' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
          }`}
          title="Examples"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-semibold">Examples</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'files' && <FileTree />}

        {activeTab === 'packages' && (
          <div className="p-5 overflow-y-auto h-full relative z-10">
            <div className="mb-6">
              <h3 className="text-lg font-bold gradient-text-green mb-2">Installed Packages</h3>
              <p className="text-xs text-gray-400">Dependencies ready for your project</p>
            </div>
            <div className="space-y-3">
              <div className="glass card-hover p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">react</span>
                  <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">^18.3.1</span>
                </div>
                <p className="text-xs text-gray-400">JavaScript library for building UIs</p>
              </div>
              <div className="glass card-hover p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">react-native</span>
                  <span className="text-xs text-lime-400 bg-lime-500/20 px-2 py-1 rounded-full">^0.74.0</span>
                </div>
                <p className="text-xs text-gray-400">Framework for building native apps</p>
              </div>
              <div className="glass card-hover p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">zustand</span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">^4.5.2</span>
                </div>
                <p className="text-xs text-gray-400">State management solution</p>
              </div>
              <div className="glass card-hover p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">axios</span>
                  <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full">^1.12.2</span>
                </div>
                <p className="text-xs text-gray-400">HTTP client for the browser</p>
              </div>
              <div className="glass card-hover p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">expo</span>
                  <span className="text-xs text-green-300 bg-green-600/20 px-2 py-1 rounded-full">~49.0.0</span>
                </div>
                <p className="text-xs text-gray-400">Platform for universal React apps</p>
              </div>
              <div className="glass card-hover p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">@babel/standalone</span>
                  <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">^7.24.4</span>
                </div>
                <p className="text-xs text-gray-400">Babel compiler for JavaScript</p>
              </div>
              <div className="glass card-hover p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">socket.io-client</span>
                  <span className="text-xs text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded-full">^4.7.5</span>
                </div>
                <p className="text-xs text-gray-400">Real-time communication</p>
              </div>
              <div className="glass card-hover p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">nanoid</span>
                  <span className="text-xs text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded-full">^5.0.7</span>
                </div>
                <p className="text-xs text-gray-400">Unique ID generator</p>
              </div>
            </div>
            <div className="mt-6 glass p-4 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <span className="text-sm font-semibold text-green-400">Pro Tip</span>
              </div>
              <p className="text-xs text-gray-300 mb-2">Install more packages using terminal:</p>
              <code className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded font-mono">npm install &lt;package-name&gt;</code>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="p-5 overflow-y-auto h-full relative z-10">
            <div className="mb-6">
              <h3 className="text-lg font-bold gradient-text-green mb-2">Quick Start Templates</h3>
              <p className="text-xs text-gray-400">Ready-to-use code templates</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => loadTemplate('Counter App', counterTemplate)}
                className="w-full p-4 text-left glass card-hover rounded-xl interactive-subtle group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">🔢</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Counter App</div>
                    <p className="text-xs text-gray-400">Simple counter with increment/reset</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => loadTemplate('Todo List', todoTemplate)}
                className="w-full p-4 text-left glass card-hover rounded-xl interactive-subtle group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">📝</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Todo List</div>
                    <p className="text-xs text-gray-400">Task manager with add/delete</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => loadTemplate('Animation', animationTemplate)}
                className="w-full p-4 text-left glass card-hover rounded-xl interactive-subtle group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">🎨</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Animation Demo</div>
                    <p className="text-xs text-gray-400">Scale and rotation animations</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="p-5 overflow-y-auto h-full relative z-10">
            <div className="mb-6">
              <h3 className="text-lg font-bold gradient-text-green mb-2">Code Examples</h3>
              <p className="text-xs text-gray-400">Learn from practical examples</p>
            </div>
            <div className="space-y-3">
              <button className="w-full p-4 text-left glass card-hover rounded-xl interactive-subtle group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
                    <span className="text-black text-lg font-bold">🎨</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Animations</div>
                    <p className="text-xs text-gray-400">Transform, opacity, and more</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 text-left glass card-hover rounded-xl interactive-subtle group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
                    <span className="text-black text-lg font-bold">🌐</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">API Calls</div>
                    <p className="text-xs text-gray-400">Fetch data from REST APIs</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 text-left glass card-hover rounded-xl interactive-subtle group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
                    <span className="text-black text-lg font-bold">📝</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Forms</div>
                    <p className="text-xs text-gray-400">Input validation and handling</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 text-left glass card-hover rounded-xl interactive-subtle group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
                    <span className="text-black text-lg font-bold">🧭</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">Navigation</div>
                    <p className="text-xs text-gray-400">Stack and tab navigation</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 text-left glass card-hover rounded-xl interactive-subtle group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-lg flex items-center justify-center">
                    <span className="text-black text-lg font-bold">🎯</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">State Management</div>
                    <p className="text-xs text-gray-400">Context, Redux, Zustand</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

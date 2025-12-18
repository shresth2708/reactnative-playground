import { Terminal, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';

export default function Console() {
  const { logs, clearLogs, socket } = usePlaygroundStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'console' | 'terminal'>('console');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ command: string; output: string }>>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentDir, setCurrentDir] = useState('~/project');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  useEffect(() => {
    if (!socket) return;

    socket.on('terminal:output', ({ output, cwd }: any) => {
      setTerminalHistory(prev => {
        const newHistory = [...prev];
        if (newHistory.length > 0) {
          newHistory[newHistory.length - 1].output = output;
        }
        return newHistory;
      });
      if (cwd) setCurrentDir(cwd);
    });

    return () => {
      socket.off('terminal:output');
    };
  }, [socket]);

  const executeCommand = () => {
    if (!currentCommand.trim() || !socket) return;

    setTerminalHistory(prev => [...prev, { command: currentCommand, output: '' }]);
    socket.emit('terminal:command', { command: currentCommand });
    setCurrentCommand('');
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-lime-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className={`bg-slate-800/95 backdrop-blur-xl border-t border-slate-700/50 flex flex-col transition-all duration-300 ${
      isExpanded ? 'h-64' : 'h-12'
    }`}>
      <div className="h-12 flex items-center justify-between px-6 border-b border-slate-700/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => setActiveTab('console')}
              className={`text-sm font-medium transition-all duration-200 ${
                activeTab === 'console' ? 'text-white bg-slate-700/50 px-3 py-1.5 rounded-lg' : 'text-slate-400 hover:text-slate-300 px-3 py-1.5'
              }`}
            >
              Console
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`text-sm font-medium transition-all duration-200 ${
                activeTab === 'terminal' ? 'text-white bg-slate-700/50 px-3 py-1.5 rounded-lg' : 'text-slate-400 hover:text-slate-300 px-3 py-1.5'
              }`}
            >
              Terminal
            </button>
          </div>
          {activeTab === 'console' && logs.length > 0 && (
            <span className="text-xs bg-lime-500/20 text-lime-400 px-2 py-1 rounded-md font-medium">
              {logs.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => activeTab === 'console' ? clearLogs() : setTerminalHistory([])}
            className="p-2 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 rounded-lg transition-all duration-200"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 rounded-lg transition-all duration-200"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <>
          {activeTab === 'console' ? (
            <div className="flex-1 overflow-y-auto p-2 font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No console output</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="py-2 px-3 hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
                    <span className={getLogColor(log.type)}>[{log.type}]</span>{' '}
                    <span className="text-gray-300">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-2 font-mono text-sm">
                {terminalHistory.length === 0 ? (
                  <div className="text-gray-500">
                    <div>React Native Playground Terminal</div>
                    <div className="mt-2 text-xs">
                      Available commands: npm install, ls, cat, pwd, echo, clear, etc.
                    </div>
                  </div>
                ) : (
                  terminalHistory.map((entry, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="text-green-400">
                        $ {entry.command}
                      </div>
                      {entry.output && (
                        <div className="text-gray-300 whitespace-pre-wrap">{entry.output}</div>
                      )}
                    </div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>
              <div className="border-t border-slate-700/50 p-3 flex items-center gap-2 font-mono text-sm">
                <span className="text-lime-400">{currentDir}</span>
                <span className="text-green-400">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') executeCommand();
                  }}
                  className="flex-1 bg-transparent text-gray-300 outline-none"
                  placeholder="Type a command..."
                  autoFocus
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Clock, RotateCcw, X } from 'lucide-react';

interface Version {
  id: string;
  timestamp: number;
  content: string;
  author: string;
  message: string;
}

interface VersionHistoryProps {
  fileId: string;
  onRestore: (content: string) => void;
}

export default function VersionHistory({ onRestore }: VersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [versions] = useState<Version[]>([
    {
      id: '1',
      timestamp: Date.now() - 3600000,
      content: '// Version 1',
      author: 'You',
      message: 'Initial commit',
    },
    {
      id: '2',
      timestamp: Date.now() - 1800000,
      content: '// Version 2',
      author: 'You',
      message: 'Added button component',
    },
    {
      id: '3',
      timestamp: Date.now() - 900000,
      content: '// Version 3',
      author: 'Alice',
      message: 'Fixed styling',
    },
  ]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-20 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg transition-colors z-40"
        title="Version History"
      >
        <Clock className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 bottom-20 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-40">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Version History
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {versions.map((version) => (
          <div
            key={version.id}
            className="p-3 border-b border-gray-700 hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-medium text-white">{version.message}</div>
                <div className="text-xs text-gray-400">
                  by {version.author} • {new Date(version.timestamp).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Restore this version?')) {
                    onRestore(version.content);
                    setIsOpen(false);
                  }
                }}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                title="Restore"
              >
                <RotateCcw className="w-4 h-4 text-blue-400" />
              </button>
            </div>
            <pre className="text-xs text-gray-400 bg-gray-900 p-2 rounded overflow-x-auto">
              {version.content.substring(0, 100)}...
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

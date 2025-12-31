import { useState } from 'react';
import { GitCompare, X } from 'lucide-react';

interface CodeDiffProps {
  originalCode: string;
  modifiedCode: string;
}

export default function CodeDiff({ originalCode, modifiedCode }: CodeDiffProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getDiff = () => {
    const originalLines = originalCode.split('\n');
    const modifiedLines = modifiedCode.split('\n');
    const maxLines = Math.max(originalLines.length, modifiedLines.length);
    
    const diff = [];
    for (let i = 0; i < maxLines; i++) {
      const original = originalLines[i] || '';
      const modified = modifiedLines[i] || '';
      
      if (original !== modified) {
        diff.push({
          line: i + 1,
          original,
          modified,
          type: !original ? 'added' : !modified ? 'removed' : 'modified',
        });
      }
    }
    return diff;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-36 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg transition-colors z-40"
        title="View Changes"
      >
        <GitCompare className="w-5 h-5" />
      </button>
    );
  }

  const diff = getDiff();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5" />
            Code Changes ({diff.length})
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-700 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {diff.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No changes detected
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {diff.map((change, idx) => (
                <div key={idx} className="border border-gray-700 rounded overflow-hidden">
                  <div className="bg-gray-900 px-3 py-1 text-xs text-gray-400">
                    Line {change.line}
                  </div>
                  {change.type !== 'added' && (
                    <div className="bg-red-900/20 border-l-4 border-red-500 px-3 py-2">
                      <span className="text-red-400 text-xs mr-2">-</span>
                      <code className="text-sm text-gray-300 font-mono">{change.original}</code>
                    </div>
                  )}
                  {change.type !== 'removed' && (
                    <div className="bg-green-900/20 border-l-4 border-green-500 px-3 py-2">
                      <span className="text-green-400 text-xs mr-2">+</span>
                      <code className="text-sm text-gray-300 font-mono">{change.modified}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

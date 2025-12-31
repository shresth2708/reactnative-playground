import { useState } from 'react';
import { Github, X } from 'lucide-react';

// interface GitHubExportProps {
//   projectData: any;
// }

export default function GitHubExport() {
  const [isOpen, setIsOpen] = useState(false);
  const [repoName, setRepoName] = useState('my-react-native-app');
  const [description, setDescription] = useState('Created with React Native Playground');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportToGitHub = async () => {
    setIsExporting(true);
    try {
      // In real implementation, this would use GitHub API
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Project would be exported to GitHub as "${repoName}"`);
      setIsOpen(false);
    } catch (error) {
      alert('Failed to export to GitHub');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
        title="Export to GitHub"
      >
        <Github className="w-4 h-4" />
        Export to GitHub
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Github className="w-5 h-5" />
            Export to GitHub
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-700 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Repository Name</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              placeholder="my-react-native-app"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded resize-none"
              rows={3}
              placeholder="Project description..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="private" className="text-sm text-gray-300">
              Make repository private
            </label>
          </div>

          <div className="bg-gray-900 p-3 rounded text-xs text-gray-400">
            <p className="mb-2">This will create a new GitHub repository with:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>All project files</li>
              <li>README.md with setup instructions</li>
              <li>package.json with dependencies</li>
              <li>.gitignore file</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={exportToGitHub}
            disabled={isExporting || !repoName}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}

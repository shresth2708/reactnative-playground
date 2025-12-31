import { useState } from 'react';
import { X, Download, FileArchive, Github, Code, FileText } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: any;
}

export default function DownloadModal({ isOpen, onClose, projectData }: DownloadModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const downloadAsZip = async () => {
    setIsDownloading(true);
    try {
      // Create a simple text file with all code
      const content = JSON.stringify(projectData, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rn-playground-project.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsText = () => {
    const files = projectData.files || [];
    let content = '// React Native Playground Project\n\n';
    
    const extractFiles = (nodes: any[], prefix = '') => {
      nodes.forEach(node => {
        if (node.type === 'file' && node.content) {
          content += `// File: ${prefix}${node.name}\n`;
          content += `${'='.repeat(50)}\n`;
          content += node.content;
          content += '\n\n';
        }
        if (node.children) {
          extractFiles(node.children, `${prefix}${node.name}/`);
        }
      });
    };
    
    extractFiles(files);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const files = projectData.files || [];
    let content = '';
    
    const extractFiles = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.type === 'file' && node.content) {
          content += node.content + '\n\n';
        }
        if (node.children) {
          extractFiles(node.children);
        }
      });
    };
    
    extractFiles(files);
    navigator.clipboard.writeText(content);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Download & Export</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={downloadAsZip}
            disabled={isDownloading}
            className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3 text-left"
          >
            <FileArchive className="w-6 h-6 text-blue-400" />
            <div className="flex-1">
              <div className="font-medium text-white">Download as JSON</div>
              <div className="text-sm text-gray-400">Save project data</div>
            </div>
            <Download className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={downloadAsText}
            className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3 text-left"
          >
            <FileText className="w-6 h-6 text-green-400" />
            <div className="flex-1">
              <div className="font-medium text-white">Download as Text</div>
              <div className="text-sm text-gray-400">All code in one file</div>
            </div>
            <Download className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3 text-left"
          >
            <Code className="w-6 h-6 text-purple-400" />
            <div className="flex-1">
              <div className="font-medium text-white">Copy to Clipboard</div>
              <div className="text-sm text-gray-400">Copy all code</div>
            </div>
          </button>

          <button
            onClick={() => alert('GitHub export coming soon!')}
            className="w-full p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-3 text-left"
          >
            <Github className="w-6 h-6 text-gray-400" />
            <div className="flex-1">
              <div className="font-medium text-white">Export to GitHub</div>
              <div className="text-sm text-gray-400">Coming soon</div>
            </div>
          </button>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

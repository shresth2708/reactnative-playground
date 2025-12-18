import { X, Save, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [autoSave, setAutoSave] = useState(true);
  const [minimap, setMinimap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);

  if (!isOpen) return null;

  const saveSettings = () => {
    localStorage.setItem('editorSettings', JSON.stringify({
      fontSize,
      tabSize,
      autoSave,
      minimap,
      lineNumbers,
      wordWrap
    }));
    alert('Settings saved!');
    onClose();
  };

  const resetSettings = () => {
    setFontSize(14);
    setTabSize(2);
    setAutoSave(true);
    setMinimap(true);
    setLineNumbers(true);
    setWordWrap(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-800">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Editor Settings */}
          <div>
            <h3 className="text-md font-semibold text-white mb-4">Editor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Tab Size: {tabSize} spaces
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="2"
                  value={tabSize}
                  onChange={(e) => setTabSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Auto Save</span>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autoSave ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      autoSave ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Show Minimap</span>
                <button
                  onClick={() => setMinimap(!minimap)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    minimap ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      minimap ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Line Numbers</span>
                <button
                  onClick={() => setLineNumbers(!lineNumbers)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    lineNumbers ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      lineNumbers ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Word Wrap</span>
                <button
                  onClick={() => setWordWrap(!wordWrap)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    wordWrap ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      wordWrap ? 'transform translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-md font-semibold text-white mb-4">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Save</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Cmd/Ctrl + S</kbd>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Find</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Cmd/Ctrl + F</kbd>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Comment</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Cmd/Ctrl + /</kbd>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Close Tab</span>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Cmd/Ctrl + W</kbd>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-md font-semibold text-white mb-4">About</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>React Native Playground v3.0.0</p>
              <p>Built with React, TypeScript, and AI</p>
              <p>© 2025 RN Playground</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2 p-4 border-t border-gray-700 sticky bottom-0 bg-gray-800">
          <button
            onClick={resetSettings}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

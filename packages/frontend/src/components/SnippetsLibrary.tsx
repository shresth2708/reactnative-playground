import { useState } from 'react';
import { Plus, Copy } from 'lucide-react';
import { usePlaygroundStore } from '../store/playgroundStore';

const snippets = [
  {
    id: '1',
    title: 'useState Hook',
    code: `const [state, setState] = useState(initialValue);`,
    category: 'Hooks',
  },
  {
    id: '2',
    title: 'useEffect Hook',
    code: `useEffect(() => {\n  // Effect\n  return () => {};\n}, []);`,
    category: 'Hooks',
  },
  {
    id: '3',
    title: 'Fetch API',
    code: `const fetchData = async () => {\n  const res = await fetch(url);\n  return res.json();\n};`,
    category: 'API',
  },
];

export default function SnippetsLibrary() {
  const [search, setSearch] = useState('');
  const { updateFileContent, openTabs, activeTabId } = usePlaygroundStore();

  const insertSnippet = (code: string) => {
    const activeTab = openTabs.find((tab) => tab.id === activeTabId);
    if (activeTab) {
      updateFileContent(activeTab.fileId, activeTab.content + '\n\n' + code);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {snippets.map((snippet) => (
          <div key={snippet.id} className="bg-gray-700 rounded p-3 group">
            <div className="flex justify-between mb-2">
              <h4 className="text-sm text-white">{snippet.title}</h4>
              <div className="flex gap-1">
                <button
                  onClick={() => insertSnippet(snippet.code)}
                  className="p-1 hover:bg-gray-600 rounded"
                >
                  <Plus className="w-4 h-4 text-green-400" />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(snippet.code)}
                  className="p-1 hover:bg-gray-600 rounded"
                >
                  <Copy className="w-4 h-4 text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

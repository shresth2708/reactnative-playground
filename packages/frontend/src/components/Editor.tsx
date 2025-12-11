import { useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { X, FileCode } from 'lucide-react';
import { usePlaygroundStore } from '../store/playgroundStore';

export default function Editor() {
  const { openTabs, activeTabId, updateFileContent, closeTab, setActiveTab } = usePlaygroundStore();
  const isRemoteUpdate = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const activeTab = openTabs.find((tab) => tab.id === activeTabId);

  // Detect remote updates
  useEffect(() => {
    if (activeTab) {
      isRemoteUpdate.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isRemoteUpdate.current = false;
      }, 100);
    }
  }, [activeTab?.content]);

  return (
    <div className="flex-1 flex flex-col bg-slate-800/50 border-r border-slate-700/50 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
      
      {/* Tabs */}
      <div className="flex bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/30 overflow-x-auto relative z-10">
        {openTabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-3 px-4 py-3 border-r border-slate-700/30 cursor-pointer group min-w-[140px] relative transition-all duration-200 ${
              tab.id === activeTabId
                ? 'bg-slate-700/60 text-white border-b-2 border-lime-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {/* File type indicator */}
            <div className={`w-2 h-2 rounded-full transition-colors ${
              tab.language === 'typescript' || tab.language === 'javascript' 
                ? 'bg-lime-400' 
                : tab.language === 'json' 
                  ? 'bg-green-400'
                  : 'bg-emerald-400'
            }`} />
            
            <span className="text-sm font-medium truncate flex-1">{tab.name}</span>
            
            {tab.isDirty && (
              <span className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse" />
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 rounded-md p-1 transition-all duration-200"
            >
              <X className="w-3 h-3" />
            </button>

          </div>
        ))}
      </div>

      {/* Editor */}
      {activeTab ? (
        <MonacoEditor
          key={activeTab.id}
          height="100%"
          language={activeTab.language}
          value={activeTab.content}
          onChange={(value) => {
            if (isRemoteUpdate.current) {
              return; // Skip if this is a remote update
            }
            const newContent = value || '';
            updateFileContent(activeTab.fileId, newContent, false);
          }}
          beforeMount={(monaco) => {
            // Disable annoying TypeScript errors
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: false,
              noSyntaxValidation: false,
              diagnosticCodesToIgnore: [1005, 2792, 2304, 7016, 7006, 2307, 2345]
            });

            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              target: monaco.languages.typescript.ScriptTarget.ES2020,
              allowNonTsExtensions: true,
              moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
              module: monaco.languages.typescript.ModuleKind.ESNext,
              noEmit: true,
              esModuleInterop: true,
              jsx: monaco.languages.typescript.JsxEmit.React,
              reactNamespace: 'React',
              allowJs: true,
              checkJs: false,
              strict: false,
              noImplicitAny: false,
              skipLibCheck: true,
              allowSyntheticDefaultImports: true
            });
          }}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'mouseover',
            fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: 'smooth',
            renderWhitespace: 'boundary',
          }}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 relative z-10">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-lime-500/20 rounded-full flex items-center justify-center animate-float">
              <FileCode className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No file open</h3>
            <p className="text-sm text-gray-400 max-w-md">Select a file from the sidebar to start editing, or create a new one to begin coding</p>
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs text-gray-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Ready to code
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

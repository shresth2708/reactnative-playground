import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { FileNode, EditorTab, ConsoleLog } from '../types';
import { nanoid } from 'nanoid';
import { API_URL } from '../config';

interface PlaygroundState {
  // File system
  files: FileNode[];
  activeFileId: string | null;
  openTabs: EditorTab[];
  activeTabId: string | null;

  // Code & bundling
  bundledCode: string;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  // Console
  logs: ConsoleLog[];

  // Preview
  socket: Socket | null;
  previewMode: 'web' | 'ios' | 'android';
  deviceFrame: string;

  // File operations
  createFile: (name: string, parentId?: string) => void;
  createFolder: (name: string, parentId?: string) => void;
  deleteFile: (id: string) => void;
  collectAllFiles: (nodes: FileNode[]) => any[];
  renameFile: (id: string, newName: string) => void;
  updateFileContent: (id: string, content: string, skipBroadcast?: boolean) => void;
  openFile: (fileId: string) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;

  // Code operations
  setBundledCode: (code: string) => void;
  setPreviewMode: (mode: 'web' | 'ios' | 'android') => void;
  setDeviceFrame: (frame: string) => void;

  // Console operations
  addLog: (log: Omit<ConsoleLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;

  // Connection
  connect: () => void;
  disconnect: () => void;
}

const defaultCode = `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Playground</Text>
      <Text style={styles.subtitle}>Start coding and see live results!</Text>
      
      <View style={styles.card}>
        <Text style={styles.count}>{count}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>Increment</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]}
          onPress={() => setCount(0)}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 250,
  },
  count: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#4ecca3',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#4ecca3',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 180,
  },
  resetButton: {
    backgroundColor: '#e94560',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});`;

const initialFiles: FileNode[] = [
  {
    id: 'root',
    name: 'root',
    type: 'folder',
    children: [
      {
        id: 'package-json',
        name: 'package.json',
        type: 'file',
        content: JSON.stringify({
          name: 'react-native-playground',
          version: '1.0.0',
          main: 'App.tsx',
          scripts: {
            start: 'expo start',
            android: 'expo start --android',
            ios: 'expo start --ios',
            web: 'expo start --web',
            dev: 'expo start',
            build: 'expo build'
          },
          dependencies: {
            'react': '^18.3.1',
            'react-native': '^0.74.0',
            'expo': '~49.0.0',
            'zustand': '^4.5.2',
            'axios': '^1.12.2',
            '@babel/standalone': '^7.24.4',
            'socket.io-client': '^4.7.5',
            'nanoid': '^5.0.7'
          },
          devDependencies: {
            '@types/react': '^18.2.0',
            '@types/react-native': '^0.72.0',
            'typescript': '^5.4.5'
          }
        }, null, 2),
        language: 'json',
        parentId: 'root',
      },
      {
        id: 'app-json',
        name: 'app.json',
        type: 'file',
        content: JSON.stringify({
          expo: {
            name: 'React Native Playground',
            slug: 'rn-playground',
            version: '1.0.0',
            orientation: 'portrait',
            platforms: ['ios', 'android', 'web']
          }
        }, null, 2),
        language: 'json',
        parentId: 'root',
      },
      {
        id: 'app-tsx',
        name: 'App.tsx',
        type: 'file',
        content: defaultCode,
        language: 'typescript',
        parentId: 'root',
      },
      {
        id: 'readme-md',
        name: 'README.md',
        type: 'file',
        content: `# React Native Playground

A web-based React Native development environment.

## Getting Started

1. Edit App.tsx to see live preview
2. Create components in the components/ folder
3. Install packages with terminal: \`npm install <package>\`

## Available Commands

- \`npm install <package>\` - Install a package
- \`npm start\` - Start the app
- \`ls\` - List files
- \`cat <file>\` - View file contents

## Features

- Live preview
- Real-time collaboration
- AI code assistant
- Terminal access
- Multi-file support
`,
        language: 'markdown',
        parentId: 'root',
      },
      {
        id: 'gitignore',
        name: '.gitignore',
        type: 'file',
        content: `node_modules/
.expo/
.expo-shared/
*.log
.DS_Store
`,
        language: 'plaintext',
        parentId: 'root',
      },
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        parentId: 'root',
        children: [],
      },
      {
        id: 'utils',
        name: 'utils',
        type: 'folder',
        parentId: 'root',
        children: [],
      },
    ],
  },
];

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  // File system
  files: initialFiles,
  activeFileId: 'app-tsx',
  openTabs: [
    {
      id: 'tab-app-tsx',
      fileId: 'app-tsx',
      name: 'App.tsx',
      content: defaultCode,
      isDirty: false,
      language: 'typescript',
    },
  ],
  activeTabId: 'tab-app-tsx',

  // Code & bundling
  bundledCode: '',
  isConnected: false,
  isLoading: false,
  error: null,

  // Console
  logs: [],

  // Preview
  socket: null,
  previewMode: 'ios',
  deviceFrame: 'iphone-15-pro',

  // File operations
  createFile: (name, parentId = 'root') => {
    const newFile: FileNode = {
      id: nanoid(),
      name,
      type: 'file',
      content: '',
      language: name.endsWith('.tsx') || name.endsWith('.ts') ? 'typescript' : 'javascript',
      parentId,
    };

    set((state) => {
      const updateChildren = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId) {
            if (node.type === 'folder') {
              return {
                ...node,
                children: [...(node.children || []), newFile],
                isOpen: true, // Auto-expand when adding files
              };
            }
          }
          if (node.children) {
            return { ...node, children: updateChildren(node.children) };
          }
          return node;
        });
      };

      return { files: updateChildren(state.files) };
    });

    // Auto-open the new file
    setTimeout(() => get().openFile(newFile.id), 100);
  },

  createFolder: (name, parentId = 'root') => {
    const newFolder: FileNode = {
      id: nanoid(),
      name,
      type: 'folder',
      children: [],
      parentId,
      isOpen: true,
    };

    set((state) => {
      const updateChildren = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === parentId) {
            if (node.type === 'folder') {
              return {
                ...node,
                children: [...(node.children || []), newFolder],
                isOpen: true, // Auto-expand parent
              };
            }
          }
          if (node.children) {
            return { ...node, children: updateChildren(node.children) };
          }
          return node;
        });
      };

      return { files: updateChildren(state.files) };
    });
  },

  deleteFile: (id) => {
    set((state) => {
      const removeNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.filter((node) => {
          if (node.id === id) return false;
          if (node.children) {
            node.children = removeNode(node.children);
          }
          return true;
        });
      };

      // Close tab if open
      const openTabs = state.openTabs.filter((tab) => tab.fileId !== id);
      const activeTabId = state.activeTabId === `tab-${id}`
        ? (openTabs[0]?.id || null)
        : state.activeTabId;

      return {
        files: removeNode(state.files),
        openTabs,
        activeTabId,
      };
    });
  },

  renameFile: (id, newName) => {
    set((state) => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return { ...node, name: newName };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };

      // Update tab name if open
      const openTabs = state.openTabs.map((tab) =>
        tab.fileId === id ? { ...tab, name: newName } : tab
      );

      return {
        files: updateNode(state.files),
        openTabs,
      };
    });
  },

  updateFileContent: (id, content, skipBroadcast = false) => {
    set((state) => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === id) {
            return { ...node, content };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };

      // Update tab content
      const openTabs = state.openTabs.map((tab) =>
        tab.fileId === id ? { ...tab, content, isDirty: true } : tab
      );

      return {
        files: updateNode(state.files),
        openTabs,
      };
    });

    // Send to backend for bundling if it's the active file
    const state = get();
    if (state.activeFileId === id && state.socket?.connected) {
      // Collect all files for multi-file bundling
      const allFiles = get().collectAllFiles(state.files);
      state.socket.emit('code:update', { code: content, files: allFiles });
    }

    // Broadcast to collaborators (skip if this update came from a collaborator)
    if (!skipBroadcast && state.socket?.connected) {
      const roomId = (state.socket as any).roomId;
      const shareId = localStorage.getItem('currentShareId');
      
      if (roomId) {
        console.log('Broadcasting code change to room:', roomId, 'file:', id);
        state.socket.emit('collaboration:code-change', { roomId, fileId: id, content });
      } else if (shareId) {
        // Auto-sync shared project with debounce
        console.log('Auto-syncing shared project:', shareId);
        
        // Clear previous timeout
        if ((window as any).__syncTimeout) {
          clearTimeout((window as any).__syncTimeout);
        }
        
        // Debounce sync by 1 second
        (window as any).__syncTimeout = setTimeout(() => {
          const allFiles = get().collectAllFiles(state.files);
          fetch(`${API_URL}/api/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              shareId,
              projectData: { files: allFiles, openTabs: state.openTabs },
            }),
          })
            .then(() => console.log('✓ Auto-synced'))
            .catch(err => console.error('Auto-sync failed:', err));
        }, 1000);
      } else {
        console.log('No roomId or shareId found, not broadcasting');
      }
    }
  },

  openFile: (fileId) => {
    const state = get();
    const findFile = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.id === fileId && node.type === 'file') return node;
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const file = findFile(state.files);
    if (!file) return;

    // Check if already open
    const existingTab = state.openTabs.find((tab) => tab.fileId === fileId);
    if (existingTab) {
      set({ activeTabId: existingTab.id, activeFileId: fileId });
      return;
    }

    // Create new tab
    const newTab: EditorTab = {
      id: `tab-${fileId}`,
      fileId,
      name: file.name,
      content: file.content || '',
      isDirty: false,
      language: file.language || 'typescript',
    };

    set((state) => ({
      openTabs: [...state.openTabs, newTab],
      activeTabId: newTab.id,
      activeFileId: fileId,
    }));
  },

  closeTab: (tabId) => {
    set((state) => {
      const openTabs = state.openTabs.filter((tab) => tab.id !== tabId);
      const activeTabId = state.activeTabId === tabId
        ? (openTabs[0]?.id || null)
        : state.activeTabId;
      const activeFileId = activeTabId
        ? openTabs.find((tab) => tab.id === activeTabId)?.fileId || null
        : null;

      return { openTabs, activeTabId, activeFileId };
    });
  },

  setActiveTab: (tabId) => {
    const state = get();
    const tab = state.openTabs.find((t) => t.id === tabId);
    if (tab) {
      set({ activeTabId: tabId, activeFileId: tab.fileId });
    }
  },

  setBundledCode: (bundledCode) => set({ bundledCode }),

  setPreviewMode: (mode) => set({ previewMode: mode }),

  setDeviceFrame: (frame) => set({ deviceFrame: frame }),

  addLog: (log) => {
    const newLog: ConsoleLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    set((state) => ({ logs: [...state.logs, newLog] }));
  },

  clearLogs: () => set({ logs: [] }),

  connect: () => {
    const socket = io(API_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      set({ isConnected: true, socket });
      get().addLog({ type: 'info', message: 'Connected to playground server' });
      const activeTab = get().openTabs.find((tab) => tab.id === get().activeTabId);
      if (activeTab) {
        socket.emit('code:update', { code: activeTab.content });
      }
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
      get().addLog({ type: 'warn', message: 'Disconnected from server' });
    });

    socket.on('bundle:ready', ({ code, error }) => {
      if (error) {
        set({ error, isLoading: false });
        get().addLog({ type: 'error', message: error });
      } else {
        set({ bundledCode: code, error: null, isLoading: false });
      }
    });

    socket.on('console:log', ({ type, message }) => {
      get().addLog({ type, message });
    });

    // Real-time collaboration code sync
    socket.on('collaboration:code-updated', ({ fileId, content }) => {
      console.log('Received code update for file:', fileId);
      // Update file content without broadcasting back (skipBroadcast = true)
      get().updateFileContent(fileId, content, true);
    });

    // Listen for file updates from terminal (npm install, etc.)
    socket.on('file:update', ({ fileId, content }) => {
      console.log('File updated from terminal:', fileId);
      get().updateFileContent(fileId, content, true);
    });

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  collectAllFiles: (nodes: FileNode[]): any[] => {
    const files: any[] = [];
    const traverse = (nodeList: FileNode[]) => {
      nodeList.forEach(node => {
        if (node.type === 'file' && node.content) {
          files.push({
            id: node.id,
            name: node.name,
            content: node.content
          });
        }
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return files;
  },
}));

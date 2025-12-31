// File system types
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  parentId?: string;
  language?: string;
  isOpen?: boolean;
}

export interface EditorTab {
  id: string;
  fileId: string;
  name: string;
  content: string;
  isDirty: boolean;
  language: string;
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export interface DeviceFrame {
  id: string;
  name: string;
  width: number;
  height: number;
  type: 'ios' | 'android' | 'web';
}

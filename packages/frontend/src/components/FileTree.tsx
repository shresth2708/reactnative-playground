import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { usePlaygroundStore } from '../store/playgroundStore';
import { FileNode } from '../types';

interface FileTreeItemProps {
  node: FileNode;
  level: number;
}

function FileTreeItem({ node, level }: FileTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(node.isOpen !== false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [showMenu, setShowMenu] = useState(false);
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  
  const { openFile, deleteFile, renameFile, activeFileId, createFile, createFolder } = usePlaygroundStore();
  
  const isActive = node.id === activeFileId;
  
  const handleClick = () => {
    if (node.type === 'file') {
      openFile(node.id);
    } else {
      setIsExpanded(!isExpanded);
    }
  };
  
  const handleRename = () => {
    if (newName && newName !== node.name) {
      renameFile(node.id, newName);
    }
    setIsRenaming(false);
    setShowMenu(false);
  };
  
  const handleDelete = () => {
    if (confirm(`Delete ${node.name}?`)) {
      deleteFile(node.id);
    }
    setShowMenu(false);
  };
  
  const getIcon = () => {
    if (node.type === 'folder') {
      return isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };
  
  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1.5 cursor-pointer hover:bg-gray-700 group relative ${
          isActive ? 'bg-lime-500/20 text-lime-400' : 'text-gray-300'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {node.type === 'folder' && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-0.5">
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        )}
        
        <div className="flex items-center gap-2 flex-1 min-w-0" onClick={handleClick}>
          {getIcon()}
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') setIsRenaming(false);
              }}
              className="bg-gray-800 text-white px-1 py-0.5 text-sm rounded flex-1 min-w-0"
              autoFocus
            />
          ) : (
            <span className="text-sm truncate">{node.name}</span>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-600 rounded"
          >
            <MoreVertical className="w-3 h-3" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 min-w-[150px]">
              {node.type === 'folder' && (
                <>
                  <button
                    onClick={() => {
                      setShowNewFileInput(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    New File
                  </button>
                  <button
                    onClick={() => {
                      setShowNewFolderInput(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Folder className="w-3 h-3" />
                    New Folder
                  </button>
                  <div className="border-t border-gray-700 my-1" />
                </>
              )}
              <button
                onClick={() => {
                  setIsRenaming(true);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2"
              >
                <Edit2 className="w-3 h-3" />
                Rename
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-700 text-red-400 flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {node.type === 'folder' && isExpanded && (
        <div>
          {showNewFileInput && (
            <div className="px-2 py-1.5" style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onBlur={() => {
                  if (newItemName) {
                    createFile(newItemName, node.id);
                  }
                  setShowNewFileInput(false);
                  setNewItemName('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (newItemName) {
                      createFile(newItemName, node.id);
                    }
                    setShowNewFileInput(false);
                    setNewItemName('');
                  }
                  if (e.key === 'Escape') {
                    setShowNewFileInput(false);
                    setNewItemName('');
                  }
                }}
                placeholder="filename.tsx"
                className="w-full bg-gray-800 text-white px-2 py-1 text-sm rounded border border-blue-500"
                autoFocus
              />
            </div>
          )}
          
          {showNewFolderInput && (
            <div className="px-2 py-1.5" style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onBlur={() => {
                  if (newItemName) {
                    createFolder(newItemName, node.id);
                  }
                  setShowNewFolderInput(false);
                  setNewItemName('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (newItemName) {
                      createFolder(newItemName, node.id);
                    }
                    setShowNewFolderInput(false);
                    setNewItemName('');
                  }
                  if (e.key === 'Escape') {
                    setShowNewFolderInput(false);
                    setNewItemName('');
                  }
                }}
                placeholder="folder-name"
                className="w-full bg-gray-800 text-white px-2 py-1 text-sm rounded border border-blue-500"
                autoFocus
              />
            </div>
          )}
          
          {node.children && node.children.map((child) => (
            <FileTreeItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree() {
  const { files, createFile, createFolder } = usePlaygroundStore();
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  
  const handleCreateFile = () => {
    if (newItemName) {
      createFile(newItemName);
      setNewItemName('');
      setShowNewFileInput(false);
    }
  };
  
  const handleCreateFolder = () => {
    if (newItemName) {
      createFolder(newItemName);
      setNewItemName('');
      setShowNewFolderInput(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase">Files</span>
        <div className="flex gap-1">
          <button
            onClick={() => setShowNewFileInput(true)}
            className="p-1 hover:bg-gray-700 rounded"
            title="New File"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="p-1 hover:bg-gray-700 rounded"
            title="New Folder"
          >
            <Folder className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {showNewFileInput && (
          <div className="px-2 py-1.5">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={handleCreateFile}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') {
                  setShowNewFileInput(false);
                  setNewItemName('');
                }
              }}
              placeholder="filename.tsx"
              className="w-full bg-gray-800 text-white px-2 py-1 text-sm rounded border border-blue-500"
              autoFocus
            />
          </div>
        )}
        
        {showNewFolderInput && (
          <div className="px-2 py-1.5">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={handleCreateFolder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') {
                  setShowNewFolderInput(false);
                  setNewItemName('');
                }
              }}
              placeholder="folder-name"
              className="w-full bg-gray-800 text-white px-2 py-1 text-sm rounded border border-blue-500"
              autoFocus
            />
          </div>
        )}
        
        {files.map((node) => (
          <FileTreeItem key={node.id} node={node} level={0} />
        ))}
      </div>
    </div>
  );
}

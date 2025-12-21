import { Lock, Unlock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import { useCollaborationStore } from '../store/collaborationStore';

export default function FileLock() {
  const { activeFileId, socket } = usePlaygroundStore();
  const { roomId } = useCollaborationStore();
  const [lockedBy, setLockedBy] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on('file:locked', ({ fileId, userName }: any) => {
      if (fileId === activeFileId) {
        setLockedBy(userName);
        setIsLocked(true);
      }
    });

    socket.on('file:unlocked', ({ fileId }: any) => {
      if (fileId === activeFileId) {
        setLockedBy(null);
        setIsLocked(false);
      }
    });

    return () => {
      socket.off('file:locked');
      socket.off('file:unlocked');
    };
  }, [socket, roomId, activeFileId]);

  const toggleLock = () => {
    if (!socket || !roomId || !activeFileId) return;

    if (isLocked && lockedBy === 'You') {
      socket.emit('file:unlock', { roomId, fileId: activeFileId });
      setIsLocked(false);
      setLockedBy(null);
    } else if (!isLocked) {
      socket.emit('file:lock', { roomId, fileId: activeFileId });
      setIsLocked(true);
      setLockedBy('You');
    }
  };

  if (!roomId) return null;

  return (
    <div className="fixed bottom-4 left-72 flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 z-30">
      {isLocked ? (
        <>
          <Lock className="w-4 h-4 text-red-400" />
          <span className="text-sm text-gray-300">
            {lockedBy === 'You' ? 'Locked by you' : `Locked by ${lockedBy}`}
          </span>
          {lockedBy === 'You' && (
            <button
              onClick={toggleLock}
              className="ml-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
            >
              Unlock
            </button>
          )}
        </>
      ) : (
        <>
          <Unlock className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-300">Unlocked</span>
          <button
            onClick={toggleLock}
            className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
          >
            Lock File
          </button>
        </>
      )}
    </div>
  );
}

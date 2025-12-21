import { useEffect, useState } from 'react';
import { useCollaborationStore } from '../store/collaborationStore';
import { usePlaygroundStore } from '../store/playgroundStore';

export default function CursorPresence() {
  const { users } = useCollaborationStore();
  const { socket } = usePlaygroundStore();
  const [cursors, setCursors] = useState<Map<string, { line: number; column: number; color: string; name: string }>>(new Map());

  useEffect(() => {
    if (!socket) return;

    socket.on('collaboration:cursor-update', ({ userId, cursor }: any) => {
      const user = users.find(u => u.id === userId);
      if (user) {
        setCursors(prev => new Map(prev).set(userId, {
          ...cursor,
          color: user.color,
          name: user.name,
        }));
      }
    });

    return () => {
      socket.off('collaboration:cursor-update');
    };
  }, [socket, users]);

  return (
    <div className="fixed top-20 right-4 space-y-1 z-30">
      {Array.from(cursors.entries()).map(([userId, cursor]) => (
        <div
          key={userId}
          className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: cursor.color }}
          />
          <span className="text-gray-300">
            {cursor.name} • Line {cursor.line}
          </span>
        </div>
      ))}
    </div>
  );
}

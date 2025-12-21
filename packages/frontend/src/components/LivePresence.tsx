import { useCollaborationStore } from '../store/collaborationStore';

export default function LivePresence() {
  const { users, isCollaborating } = useCollaborationStore();

  if (!isCollaborating || users.length === 0) return null;

  return (
    <div className="fixed top-16 left-4 flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 z-30">
      <div className="flex -space-x-2">
        {users.slice(0, 5).map((user) => (
          <div
            key={user.id}
            className="w-8 h-8 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {users.length > 5 && (
          <div className="w-8 h-8 rounded-full border-2 border-gray-800 bg-gray-600 flex items-center justify-center text-white text-xs">
            +{users.length - 5}
          </div>
        )}
      </div>
      <span className="text-sm text-gray-300">
        {users.length} {users.length === 1 ? 'user' : 'users'} online
      </span>
    </div>
  );
}

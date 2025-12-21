import { useState, useEffect, useRef } from 'react';
import { Users, MessageCircle, X, Send, UserPlus, LogOut, Video } from 'lucide-react';
import { useCollaborationStore } from '../store/collaborationStore';
import { usePlaygroundStore } from '../store/playgroundStore';
import VideoCall from './VideoCall';
import IncomingCall from './IncomingCall';

export default function CollaborationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'chat'>('users');
  const [chatInput, setChatInput] = useState('');
  const [activeCall, setActiveCall] = useState<{ userId: string; userName: string } | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ userId: string; userName: string; offer: RTCSessionDescriptionInit } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { socket } = usePlaygroundStore();
  const {
    roomId,
    users,
    chatMessages,
    isCollaborating,
    joinRoom,
    leaveRoom,
    sendChatMessage,
    addUser,
    removeUser,
    setUsers,
    addChatMessage,
  } = useCollaborationStore();

  useEffect(() => {
    if (!socket || !isCollaborating) return;

    const handleUserJoined = (user: any) => {
      console.log('User joined:', user);
      addUser(user);
      addChatMessage({
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        message: `${user.name} joined the session`,
        timestamp: Date.now(),
      });
    };

    const handleUserLeft = ({ userId, userName }: any) => {
      removeUser(userId);
      addChatMessage({
        id: Date.now().toString(),
        userId: 'system',
        userName: 'System',
        message: `${userName} left the session`,
        timestamp: Date.now(),
      });
    };

    const handleChatMessage = (message: any) => {
      console.log('Chat message received:', message);
      addChatMessage(message);
    };

    const handleUsers = (userList: any[]) => {
      console.log('Received users list:', userList);
      setUsers(userList);
    };

    const handleIncomingCall = ({ callerUserId, callerUserName, offer }: any) => {
      setIncomingCall({ userId: callerUserId, userName: callerUserName, offer });
    };

    socket.on('collaboration:user-joined', handleUserJoined);
    socket.on('collaboration:user-left', handleUserLeft);
    socket.on('collaboration:chat-message', handleChatMessage);
    socket.on('collaboration:users', handleUsers);
    socket.on('video:incoming-call', handleIncomingCall);

    return () => {
      socket.off('collaboration:user-joined', handleUserJoined);
      socket.off('collaboration:user-left', handleUserLeft);
      socket.off('collaboration:chat-message', handleChatMessage);
      socket.off('collaboration:users', handleUsers);
      socket.off('video:incoming-call', handleIncomingCall);
    };
  }, [socket, isCollaborating, addUser, removeUser, setUsers, addChatMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleJoinRoom = () => {
    if (!socket) return;
    
    // Check if there's a share room ID from URL
    const shareRoomId = (window as any).shareRoomId;
    const defaultRoomId = shareRoomId || '';
    
    const newRoomId = prompt('Enter room ID (or leave empty for new room):', defaultRoomId) || Date.now().toString();
    joinRoom(newRoomId, socket);
  };

  const handleLeaveRoom = () => {
    if (!socket) return;
    leaveRoom(socket);
    setIsOpen(false);
  };

  const handleSendMessage = () => {
    if (!socket || !chatInput.trim()) return;
    sendChatMessage(chatInput, socket);
    setChatInput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-green-600 to-teal-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <Users className="w-6 h-6 text-white" />
        {users.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
            {users.length}
          </div>
        )}
      </button>
    );
  }

  return (
    <>
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-lime-500/10 flex flex-col z-40">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-r from-lime-500/20 to-green-500/20 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-white" />
          <h3 className="font-semibold text-white">Collaboration</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {!isCollaborating ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">Start Collaborating</h4>
            <p className="text-gray-400 text-sm mb-4">
              Join a room to code together in real-time
            </p>
            <button
              onClick={handleJoinRoom}
              className="px-6 py-3 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 text-black rounded-xl flex items-center gap-2 mx-auto transition-all duration-200 font-medium shadow-lg hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex border-b border-slate-700/50">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-slate-700/60 text-lime-400 border-b-2 border-lime-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-gray-900 text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'users' ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-400 mb-2">Room ID: {roomId}</div>
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 bg-gray-700 rounded"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <div className="flex-1">
                      <div className="text-sm text-white">{user.name}</div>
                      {user.activeFile && (
                        <div className="text-xs text-gray-400">
                          Editing: {user.activeFile}
                        </div>
                      )}
                    </div>
                    {user.id !== socket?.id && (
                      <button
                        onClick={() => setActiveCall({ userId: user.id, userName: user.name })}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        title={`Video call with ${user.name}`}
                      >
                        <Video className="w-4 h-4 text-blue-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${
                      msg.userId === 'system'
                        ? 'text-center text-xs text-gray-500 italic'
                        : ''
                    }`}
                  >
                    {msg.userId !== 'system' && (
                      <div className="bg-gray-700 rounded-lg p-2">
                        <div className="text-xs text-gray-400 mb-1">
                          {msg.userName} • {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-sm text-white">{msg.message}</div>
                      </div>
                    )}
                    {msg.userId === 'system' && msg.message}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {activeTab === 'chat' && (
            <div className="p-3 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="p-3 border-t border-gray-700">
            <button
              onClick={handleLeaveRoom}
              className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Leave Room
            </button>
          </div>
        </>
      )}
    </div>

    {/* Video Call */}
    {activeCall && (
      <VideoCall
        targetUserId={activeCall.userId}
        targetUserName={activeCall.userName}
        onClose={() => setActiveCall(null)}
      />
    )}

    {/* Incoming Call */}
    {incomingCall && (
      <IncomingCall
        callerUserId={incomingCall.userId}
        callerUserName={incomingCall.userName}
        offer={incomingCall.offer}
        onAccept={() => {
          setActiveCall({ userId: incomingCall.userId, userName: incomingCall.userName });
          setIncomingCall(null);
        }}
        onReject={() => setIncomingCall(null)}
      />
    )}
    </>
  );
}

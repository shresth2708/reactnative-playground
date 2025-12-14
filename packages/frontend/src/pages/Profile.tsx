import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../config';
import { Button } from '../components/ui/Button';
import { Code, Trash2, LogOut, Plus, Clock, Users } from 'lucide-react';

interface Playground {
  id: string;
  name: string;
  files: any[];
  createdAt: number;
  updatedAt: number;
}

interface CollabRoom {
  id: string;
  roomId: string;
  name: string;
  participants: number;
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

function Profile() {
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [rooms, setRooms] = useState<CollabRoom[]>([]);
  const [activeTab, setActiveTab] = useState<'playgrounds' | 'rooms'>('playgrounds');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    fetchPlaygrounds();
  }, [isAuthenticated, navigate]);

  const fetchPlaygrounds = async () => {
    try {
      const [playgroundsRes, roomsRes] = await Promise.all([
        fetch(`${API_URL}/api/playgrounds`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/rooms`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const playgroundsData = await playgroundsRes.json();
      const roomsData = await roomsRes.json();

      if (playgroundsData.success) {
        setPlaygrounds(playgroundsData.playgrounds);
      }
      if (roomsData.success) {
        setRooms(roomsData.rooms);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this playground?')) return;

    try {
      const response = await fetch(`${API_URL}/api/playgrounds/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPlaygrounds(playgrounds.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete playground:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-lime-500 to-green-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">DC</span>
              </div>
              <span className="text-white text-xl font-semibold">DCODE Playground</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/playground">
                <Button className="bg-lime-600 hover:bg-lime-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Playground
                </Button>
              </a>
              <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-slate-700">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-600 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-lime-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{user?.name}</h1>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('playgrounds')}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === 'playgrounds'
                ? 'text-lime-400 border-b-2 border-lime-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Playgrounds ({playgrounds.length})
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === 'rooms'
                ? 'text-lime-400 border-b-2 border-lime-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Collaboration Rooms ({rooms.length})
          </button>
        </div>

        {/* Playgrounds Tab */}
        {activeTab === 'playgrounds' && playgrounds.length === 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-12 border border-gray-700 text-center">
            <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No playgrounds yet</h3>
            <p className="text-gray-400 mb-6">Create your first playground to get started</p>
            <a href="/playground">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Playground
              </Button>
            </a>
          </div>
        )}

        {activeTab === 'playgrounds' && playgrounds.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playgrounds.map((playground) => (
              <div
                key={playground.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{playground.name}</h3>
                      <p className="text-sm text-gray-400">
                        {playground.files.length} file{playground.files.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(playground.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDate(playground.updatedAt)}</span>
                </div>

                <a href={`/playground?load=${playground.id}`}>
                  <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                    Open Playground
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Collaboration Rooms Tab */}
        {activeTab === 'rooms' && rooms.length === 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-12 border border-gray-700 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No collaboration rooms yet</h3>
            <p className="text-gray-400 mb-6">Join a room to collaborate with others</p>
            <a href="/playground">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Start Collaborating
              </Button>
            </a>
          </div>
        )}

        {activeTab === 'rooms' && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{room.name}</h3>
                      <p className="text-sm text-gray-400">
                        {room.participants} participant{room.participants !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${room.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Last active {formatDate(room.updatedAt)}</span>
                </div>

                <a href={`/playground?room=${room.roomId}`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Join Room
                  </Button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

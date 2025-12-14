import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
// Removed unused Button import
import { LogIn } from 'lucide-react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/playground');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-green-600/20 to-lime-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-lime-600/15 to-green-600/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-lime-500 to-green-400 rounded-2xl flex items-center justify-center shadow-glow-green animate-glow">
              <span className="text-white text-2xl font-bold">RN</span>
            </div>
            <div>
              <span className="text-white text-3xl font-bold gradient-text-green">RN Live</span>
              <div className="text-sm text-gray-400 font-medium">Real-time Playground</div>
            </div>
          </div>
                    <h1 className="text-4xl font-bold text-white mb-2 gradient-text-green">
            Welcome Back
          </h1>
          <p className="text-gray-300 text-lg">Sign in to continue coding amazing projects</p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-10 border border-white/10 shadow-2xl animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="glass bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-medium animate-fade-in-up">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-3">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 glass border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 text-lg"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-3">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 glass border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 text-lg"
                placeholder="••••••••"
              />
            </div>

                        <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-500 hover:to-lime-500 text-black py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] shadow-glow-green interactive flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In to Continue
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-lg">
              Don't have an account?{' '}
              <a href="/signup" className="text-green-400 hover:text-green-300 font-semibold transition-all duration-300 hover:scale-105 inline-block">
                Sign up for free
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 font-medium">
            <span>←</span>
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

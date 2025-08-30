import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { error: loginError } = await login(email, password);
      if (loginError) throw loginError;

      // The login function will handle admin authentication
      // If successful, the user will be redirected by the useEffect above
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-6 sm:mt-10">
      <div className="py-4 px-6 bg-amber-600 text-white text-center">
        <UserCog className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2" />
        <h2 className="text-xl sm:text-2xl font-bold">Admin Login</h2>
        <p className="text-amber-100 text-sm sm:text-base">Access admin dashboard</p>
      </div>
      
      <form onSubmit={handleSubmit} className="py-6 px-6 sm:px-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Admin Credentials Info */}
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">Demo Admin Credentials:</h4>
          <p className="text-xs mb-1"><strong>Email:</strong> admin@example.com</p>
          <p className="text-xs"><strong>Password:</strong> admin123</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="Enter admin email"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              placeholder="Enter admin password"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Need user access?{' '}
            <button
              type="button"
              onClick={() => navigate('/user/login')}
              className="text-amber-600 hover:underline"
            >
              User Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
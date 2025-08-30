import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'user') {
      navigate('/user/dashboard');
    }
  }, [user, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { error: loginError } = await login(email, password);
      if (loginError) throw loginError;

      // Check if user has user role after successful login
      // The navigation will be handled by the useEffect above
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage('');
    
    if (!forgotEmail) {
      setForgotMessage('Please enter your email address');
      return;
    }

    // Check if email exists in registered users (localStorage fallback)
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = users.find((u: any) => u.email === forgotEmail);

    if (!userExists) {
      setForgotMessage('Email address not found');
      return;
    }

    // In a real app, this would send an email with reset link
    // For demo purposes, we'll show the password
    setForgotMessage(`Password reset instructions sent to ${forgotEmail}. For demo: Your password is "${userExists.password}"`);
  };

  if (showForgotPassword) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-6 sm:mt-10">
        <div className="py-4 px-6 bg-teal-600 text-white text-center">
          <Mail className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2" />
          <h2 className="text-xl sm:text-2xl font-bold">Forgot Password</h2>
          <p className="text-teal-100 text-sm sm:text-base">Reset your password</p>
        </div>
        
        <form onSubmit={handleForgotPassword} className="py-6 px-6 sm:px-8">
          {forgotMessage && (
            <div className={`mb-4 p-3 rounded-lg flex items-start ${
              forgotMessage.includes('sent') || forgotMessage.includes('demo') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{forgotMessage}</span>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="forgotEmail">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="forgotEmail"
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-300 mb-4 text-sm sm:text-base"
          >
            Send Reset Instructions
          </button>
          
          <button
            type="button"
            onClick={() => setShowForgotPassword(false)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300 text-sm sm:text-base"
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-6 sm:mt-10">
      <div className="py-4 px-6 bg-teal-600 text-white text-center">
        <User className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2" />
        <h2 className="text-xl sm:text-2xl font-bold">User Login</h2>
        <p className="text-teal-100 text-sm sm:text-base">Access your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="py-6 px-6 sm:px-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
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
              placeholder="Enter your email"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
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
              placeholder="Enter your password"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4 text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <div className="text-center mb-4">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-teal-600 hover:underline text-sm"
          >
            Forgot your password?
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/user/register" className="text-teal-600 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
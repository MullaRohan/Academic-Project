import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Book, User, LogOut, Menu, X, BookOpen, Users, BookText, UserPlus, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get pending verifications count for admin
  const pendingVerificationsCount = user?.role === 'admin' ? 
    JSON.parse(localStorage.getItem('pendingVerifications') || '[]').length : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-amber-500' : 'text-white hover:text-amber-500';
  };

  // Handle logo click based on authentication status
  const handleLogoClick = () => {
    if (!isAuthenticated) {
      navigate('/');
    } else if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'user') {
      navigate('/user/dashboard');
    } else {
      navigate('/');
    }
  };

  const renderAdminLinks = () => (
    <>
      <Link 
        to="/admin/dashboard" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/admin/dashboard')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        DASHBOARD
      </Link>
      <Link 
        to="/admin/books/manage" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/admin/books/manage')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        BOOKS
      </Link>
      <Link 
        to="/admin/categories" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/admin/categories')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        CATEGORIES
      </Link>
      <Link 
        to="/admin/authors" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/admin/authors')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        AUTHORS
      </Link>
      <Link 
        to="/admin/issue-books" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/admin/issue-books')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        ISSUE BOOKS
      </Link>
      <Link 
        to="/admin/students" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/admin/students')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        REG STUDENTS
      </Link>
      <Link 
        to="/admin/verification-review" 
        className={`block px-4 py-3 lg:py-2 relative text-sm lg:text-base ${isActive('/admin/verification-review')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        VERIFICATION
        {pendingVerificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 lg:top-0 lg:-right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {pendingVerificationsCount}
          </span>
        )}
      </Link>
      <Link 
        to="/admin/change-password" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/admin/change-password')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        SETTINGS
      </Link>
      <button 
        onClick={handleLogout}
        className="block w-full text-left px-4 py-3 lg:py-2 text-sm lg:text-base text-white hover:text-amber-500 transition-colors duration-200"
      >
        LOGOUT
      </button>
    </>
  );

  const renderUserLinks = () => (
    <>
      <Link 
        to="/user/dashboard" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/user/dashboard')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        Dashboard
      </Link>
      <Link 
        to="/user/books" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/user/books')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        Available Books
      </Link>
      <Link 
        to="/user/account" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/user/account')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        My Account
      </Link>
      <button 
        onClick={handleLogout}
        className="block w-full text-left px-4 py-3 lg:py-2 text-sm lg:text-base text-white hover:text-amber-500 transition-colors duration-200"
      >
        Logout
      </button>
    </>
  );

  const renderAuthLinks = () => (
    <>
      <Link 
        to="/" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        Home
      </Link>
      <Link 
        to="/user/login" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/user/login')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        User Login
      </Link>
      <Link 
        to="/admin/login" 
        className={`block px-4 py-3 lg:py-2 text-sm lg:text-base ${isActive('/admin/login')} transition-colors duration-200`}
        onClick={() => setIsMenuOpen(false)}
      >
        Admin Login
      </Link>
    </>
  );

  return (
    <nav className="bg-teal-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={handleLogoClick} className="flex items-center cursor-pointer">
              <Book className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-amber-400" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-200">
                Library TRRS
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none p-2 rounded-md hover:bg-teal-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {isAuthenticated && user?.role === 'admin' && renderAdminLinks()}
            {isAuthenticated && user?.role === 'user' && renderUserLinks()}
            {!isAuthenticated && renderAuthLinks()}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="border-t border-teal-600 pt-2">
            {isAuthenticated && user?.role === 'admin' && renderAdminLinks()}
            {isAuthenticated && user?.role === 'user' && renderUserLinks()}
            {!isAuthenticated && renderAuthLinks()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
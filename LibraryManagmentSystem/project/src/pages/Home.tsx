import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { books } = useBooks();

  // Get first 8 books regardless of status for featured section
  const featuredBooks = books.slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center py-8 sm:py-12 lg:py-16">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <Book className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-teal-600 mr-2 sm:mr-3" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800">
            Welcome to <span className="text-teal-600">Library TRRS</span>
          </h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
          Discover, borrow and enjoy a vast collection of books. Join our community of readers today!
        </p>
        
        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-12 px-4">
            <Link
              to="/user/register"
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 text-center"
            >
              Register Now
            </Link>
            <Link
              to="/user/login"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-300 text-center"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8 sm:mb-12 px-4">
            <Link
              to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 text-center"
            >
              Go to Dashboard
            </Link>
            {user?.role === 'user' && (
              <Link
                to="/user/books"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-300 text-center"
              >
                Browse Books
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Featured Books Section */}
      <div className="pb-8 sm:pb-12 lg:pb-16">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 lg:mb-8 text-center sm:text-left">
          {isAuthenticated ? 'Featured Books' : 'Featured Books - Register to Access'}
        </h2>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
          {featuredBooks.length > 0 ? (
            featuredBooks.map(book => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'available':
                    return 'bg-green-100 text-green-800';
                  case 'stockOut':
                    return 'bg-red-100 text-red-800';
                  case 'comingSoon':
                    return 'bg-blue-100 text-blue-800';
                  default:
                    return 'bg-gray-100 text-gray-800';
                }
              };

              const getStatusText = (status: string) => {
                switch (status) {
                  case 'available':
                    return 'Available';
                  case 'stockOut':
                    return 'Stock Out';
                  case 'comingSoon':
                    return 'Coming Soon';
                  default:
                    return status;
                }
              };

              return (
                <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-40 sm:h-48 lg:h-52 overflow-hidden">
                    <img 
                      src={book.coverImage} 
                      alt={`Cover of ${book.title}`} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-1 truncate" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate" title={`by ${book.author}`}>
                      by {book.author}
                    </p>
                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-2 space-y-2 xs:space-y-0">
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full truncate max-w-full">
                        {book.category}
                      </span>
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-amber-600">
                        ${book.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center space-y-2 xs:space-y-0">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(book.status)}`}>
                        {getStatusText(book.status)}
                      </span>
                      {!isAuthenticated && (
                        <span className="text-xs sm:text-sm text-gray-500">Register to borrow</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback if no books available
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 sm:h-48 lg:h-52 bg-gray-200 flex items-center justify-center">
                  <Book className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-1">Sample Book</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">by Author Name</p>
                  <p className="text-xs sm:text-sm text-gray-500">Register to access our full collection</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
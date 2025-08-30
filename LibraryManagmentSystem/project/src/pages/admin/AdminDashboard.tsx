import { Book, BookX, Users, UserCheck, BookOpen, User, Tag } from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { books, borrowedBooks } = useBooks();
  const navigate = useNavigate();
  
  // Get registered users from localStorage
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  
  // Get authors and categories from localStorage
  const savedAuthors = JSON.parse(localStorage.getItem('authors') || '[]');
  const savedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
  
  // Calculate dashboard stats
  const totalBooks = books.length;
  const booksNotReturned = borrowedBooks.filter(book => book.status === 'borrowed').length;
  const booksReturned = borrowedBooks.filter(book => book.status === 'returned').length;
  const registeredUsersCount = registeredUsers.length;
  const authorCount = savedAuthors.length;
  const categoryCount = savedCategories.length;

  const StatCard = ({ icon: Icon, count, label, color, onClick }: { 
    icon: typeof Book;
    count: number;
    label: string;
    color: string;
    onClick?: () => void;
  }) => (
    <div 
      className={`bg-white p-4 sm:p-6 rounded-lg shadow-md ${onClick ? 'cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1' : ''}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`${color} p-2 sm:p-3 rounded-full mb-3 sm:mb-4`}>
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <span className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{count}</span>
        <span className="text-gray-600 text-xs sm:text-sm text-center leading-tight">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 text-center sm:text-left">
        ADMIN DASHBOARD
      </h1>

      {/* First Row - Main Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          icon={Book}
          count={totalBooks}
          label="Books Listed"
          color="bg-green-600"
          onClick={() => navigate('/admin/books/manage')}
        />
        
        <StatCard
          icon={BookX}
          count={booksNotReturned}
          label="Books Not Returned Yet"
          color="bg-amber-600"
          onClick={() => navigate('/admin/issue-books')}
        />
        
        <StatCard
          icon={Users}
          count={registeredUsersCount}
          label="Registered Users"
          color="bg-red-600"
          onClick={() => navigate('/admin/students')}
        />
        
        <StatCard
          icon={User}
          count={authorCount}
          label="Authors Listed"
          color="bg-purple-600"
          onClick={() => navigate('/admin/authors')}
        />
      </div>

      {/* Second Row - Additional Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <StatCard
          icon={BookOpen}
          count={booksReturned}
          label="Books Returned"
          color="bg-teal-600"
          onClick={() => navigate('/admin/issue-books')}
        />
        
        <StatCard
          icon={Tag}
          count={categoryCount}
          label="Listed Categories"
          color="bg-blue-600"
          onClick={() => navigate('/admin/categories')}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
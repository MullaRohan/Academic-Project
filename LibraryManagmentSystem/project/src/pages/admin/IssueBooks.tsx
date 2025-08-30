import { useState, useEffect } from 'react';
import { Book, User, Calendar, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { useBooks } from '../../context/BookContext';

const IssueBooks = () => {
  const { books, borrowedBooks, returnBook } = useBooks();
  const [activeTab, setActiveTab] = useState<'borrowed' | 'returned' | 'overdue'>('borrowed');
  const [searchTerm, setSearchTerm] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);

  useEffect(() => {
    // Load registered users from localStorage
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setRegisteredUsers(users);
  }, []);

  // Get user name by ID
  const getUserName = (userId: string) => {
    const user = registeredUsers.find(user => user.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Get book title by ID
  const getBookTitle = (bookId: string) => {
    const book = books.find(book => book.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  // Filter borrowed books
  const borrowedBooksData = borrowedBooks.filter(borrow => borrow.status === 'borrowed');
  
  // Filter returned books
  const returnedBooksData = borrowedBooks.filter(borrow => borrow.status === 'returned');
  
  // Filter overdue books
  const overdueBooksData = borrowedBooks.filter(borrow => {
    return borrow.status === 'borrowed' && new Date(borrow.dueDate) < new Date();
  });

  // Apply search filter
  const filterBySearch = (booksList: typeof borrowedBooks) => {
    if (!searchTerm) return booksList;
    
    return booksList.filter(borrow => {
      const bookTitle = getBookTitle(borrow.bookId).toLowerCase();
      const userName = getUserName(borrow.userId).toLowerCase();
      const search = searchTerm.toLowerCase();
      
      return bookTitle.includes(search) || userName.includes(search);
    });
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'borrowed':
        return filterBySearch(borrowedBooksData);
      case 'returned':
        return filterBySearch(returnedBooksData);
      case 'overdue':
        return filterBySearch(overdueBooksData);
      default:
        return [];
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle book return
  const handleReturn = (borrowId: string) => {
    if (window.confirm('Are you sure you want to mark this book as returned?')) {
      returnBook(borrowId);
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-amber-600 text-white p-6">
        <h1 className="text-2xl font-bold">ISSUE BOOKS</h1>
        <p className="text-amber-100">Manage book borrowing and returns</p>
      </div>

      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Books Not Returned</p>
                <p className="text-2xl font-bold text-blue-800">{borrowedBooksData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-600 font-medium">Books Returned</p>
                <p className="text-2xl font-bold text-green-800">{returnedBooksData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-red-600 font-medium">Overdue Books</p>
                <p className="text-2xl font-bold text-red-800">{overdueBooksData.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by book title or user name..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap mb-6 border-b">
          <button
            className={`px-4 py-2 font-medium mr-2 ${
              activeTab === 'borrowed'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('borrowed')}
          >
            Books Not Returned ({borrowedBooksData.length})
          </button>
          <button
            className={`px-4 py-2 font-medium mr-2 ${
              activeTab === 'returned'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('returned')}
          >
            Books Returned ({returnedBooksData.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'overdue'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('overdue')}
          >
            Overdue Books ({overdueBooksData.length})
          </button>
        </div>

        {/* Table */}
        {currentData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {searchTerm 
                ? 'No books found matching your search.' 
                : `No ${activeTab} books found.`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Book Title</th>
                  <th className="py-3 px-6 text-left">Student Name</th>
                  <th className="py-3 px-6 text-left">Borrow Date</th>
                  <th className="py-3 px-6 text-left">Due Date</th>
                  {activeTab === 'returned' && (
                    <th className="py-3 px-6 text-left">Return Date</th>
                  )}
                  <th className="py-3 px-6 text-center">Status</th>
                  {activeTab === 'borrowed' && (
                    <th className="py-3 px-6 text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {currentData.map(borrow => (
                  <tr key={borrow.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <Book className="h-5 w-5 text-amber-500 mr-2" />
                        <span>{getBookTitle(borrow.bookId)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{getUserName(borrow.userId)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{formatDate(borrow.borrowDate)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className={
                          activeTab === 'overdue' || (activeTab === 'borrowed' && new Date(borrow.dueDate) < new Date())
                            ? 'text-red-600 font-medium'
                            : ''
                        }>
                          {formatDate(borrow.dueDate)}
                        </span>
                      </div>
                    </td>
                    {activeTab === 'returned' && (
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{borrow.returnDate && formatDate(borrow.returnDate)}</span>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-6 text-center">
                      {activeTab === 'returned' && (
                        <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
                          Returned
                        </span>
                      )}
                      {activeTab === 'borrowed' && (
                        <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                          Not Returned
                        </span>
                      )}
                      {activeTab === 'overdue' && (
                        <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-xs">
                          Overdue
                        </span>
                      )}
                    </td>
                    {activeTab === 'borrowed' && (
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleReturn(borrow.id)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg text-xs"
                        >
                          Mark Returned
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueBooks;
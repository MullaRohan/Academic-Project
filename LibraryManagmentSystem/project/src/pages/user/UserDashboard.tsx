import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, DollarSign, Book, User, Clock, Eye, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooks, BorrowedBook } from '../../context/BookContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { books, borrowedBooks, fines, returnBook, renewBook } = useBooks();
  const [activeTab, setActiveTab] = useState<'borrowed' | 'returned' | 'overdue' | 'fines'>('borrowed');
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  // Filter books by user and status
  const userBorrowedBooks = borrowedBooks.filter(
    borrow => borrow.userId === user?.id && borrow.status === 'borrowed'
  );
  
  const userReturnedBooks = borrowedBooks.filter(
    borrow => borrow.userId === user?.id && borrow.status === 'returned'
  );
  
  const userOverdueBooks = borrowedBooks.filter(
    borrow => {
      return borrow.userId === user?.id && 
             borrow.status === 'borrowed' && 
             new Date(borrow.dueDate) < new Date();
    }
  );

  const userFines = fines.filter(fine => fine.userId === user?.id && fine.status === 'pending');

  // Helper to format dates
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get book by ID
  const getBook = (bookId: string) => {
    return books.find(book => book.id === bookId);
  };

  // Get book title by ID
  const getBookTitle = (bookId: string) => {
    const book = books.find(book => book.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  // Handle book return
  const handleReturn = (borrowId: string) => {
    returnBook(borrowId);
  };

  // Handle book renewal
  const handleRenew = (borrowId: string) => {
    renewBook(borrowId);
  };

  // Handle PDF reading
  const handleReadPdf = (bookId: string) => {
    const book = getBook(bookId);
    if (book && book.pdfFile) {
      setSelectedBook(book);
      setShowPdfViewer(true);
    }
  };

  // Calculate total fines
  const totalFines = userFines.reduce((total, fine) => total + fine.amount, 0);

  // Statistics for dashboard cards
  const stats = [
    {
      title: 'Books Borrowed',
      value: userBorrowedBooks.length,
      icon: Book,
      color: 'bg-blue-500',
      onClick: () => setActiveTab('borrowed')
    },
    {
      title: 'Books Returned',
      value: userReturnedBooks.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      onClick: () => setActiveTab('returned')
    },
    {
      title: 'Overdue Books',
      value: userOverdueBooks.length,
      icon: AlertCircle,
      color: 'bg-red-500',
      onClick: () => setActiveTab('overdue')
    },
    {
      title: 'Total Fines',
      value: `$${totalFines.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-amber-500',
      onClick: () => setActiveTab('fines')
    }
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-teal-600 text-white p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold">User Dashboard</h1>
          <p className="text-teal-100 text-sm sm:text-base">Welcome back, {user?.name}</p>
        </div>

        <div className="p-4 sm:p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white p-3 sm:p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                onClick={stat.onClick}
              >
                <div className="flex items-center">
                  <div className={`p-2 sm:p-3 rounded-full ${stat.color} mr-2 sm:mr-4`}>
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-500 text-xs sm:text-sm font-medium truncate">{stat.title}</p>
                    <p className="text-lg sm:text-2xl font-bold truncate">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap mb-4 sm:mb-6 border-b overflow-x-auto">
            <button
              className={`px-2 sm:px-4 py-2 font-medium mr-1 sm:mr-2 text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'borrowed'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-teal-600'
              }`}
              onClick={() => setActiveTab('borrowed')}
            >
              Borrowed ({userBorrowedBooks.length})
            </button>
            <button
              className={`px-2 sm:px-4 py-2 font-medium mr-1 sm:mr-2 text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'returned'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-teal-600'
              }`}
              onClick={() => setActiveTab('returned')}
            >
              Returned ({userReturnedBooks.length})
            </button>
            <button
              className={`px-2 sm:px-4 py-2 font-medium mr-1 sm:mr-2 text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'overdue'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-teal-600'
              }`}
              onClick={() => setActiveTab('overdue')}
            >
              Overdue ({userOverdueBooks.length})
            </button>
            <button
              className={`px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'fines'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-teal-600'
              }`}
              onClick={() => setActiveTab('fines')}
            >
              Fines ({userFines.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'borrowed' && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Currently Borrowed Books</h2>
              {userBorrowedBooks.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">You have no borrowed books.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm leading-normal">
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-left">Book Title</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden sm:table-cell">Borrowed Date</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-left">Due Date</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-xs sm:text-sm">
                      {userBorrowedBooks.map(borrow => {
                        const book = getBook(borrow.bookId);
                        return (
                          <tr key={borrow.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-2 sm:py-3 px-2 sm:px-6 text-left">
                              <div className="flex items-center">
                                <Book className="h-3 w-3 sm:h-4 sm:w-4 text-teal-500 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="truncate">{getBookTitle(borrow.bookId)}</span>
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden sm:table-cell">
                              {formatDate(borrow.borrowDate)}
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-6 text-left">
                              <span className={
                                new Date(borrow.dueDate) < new Date() 
                                  ? 'text-red-600 font-medium' 
                                  : ''
                              }>
                                {formatDate(borrow.dueDate)}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-6 text-center">
                              <div className="flex flex-col sm:flex-row justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                                {book?.pdfFile && (
                                  <button
                                    onClick={() => handleReadPdf(borrow.bookId)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs flex items-center justify-center"
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Read
                                  </button>
                                )}
                                <button
                                  onClick={() => handleRenew(borrow.id)}
                                  className="bg-amber-500 hover:bg-amber-600 text-white py-1 px-2 rounded text-xs"
                                >
                                  Renew
                                </button>
                                <button
                                  onClick={() => handleReturn(borrow.id)}
                                  className="bg-teal-500 hover:bg-teal-600 text-white py-1 px-2 rounded text-xs"
                                >
                                  Return
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'returned' && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Returned Books</h2>
              {userReturnedBooks.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">You have no returned books.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm leading-normal">
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-left">Book Title</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden sm:table-cell">Borrowed Date</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-left">Return Date</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-xs sm:text-sm">
                      {userReturnedBooks.map(borrow => (
                        <tr key={borrow.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2 sm:py-3 px-2 sm:px-6 text-left">
                            <div className="flex items-center">
                              <Book className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">{getBookTitle(borrow.bookId)}</span>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden sm:table-cell">
                            {formatDate(borrow.borrowDate)}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-6 text-left">
                            {borrow.returnDate && formatDate(borrow.returnDate)}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-6 text-center">
                            <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
                              Returned
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overdue' && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Overdue Books</h2>
              {userOverdueBooks.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">You have no overdue books.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm leading-normal">
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-left">Book Title</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden sm:table-cell">Borrowed Date</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-left">Due Date</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-center">Status</th>
                        <th className="py-2 sm:py-3 px-2 sm:px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-xs sm:text-sm">
                      {userOverdueBooks.map(borrow => (
                        <tr key={borrow.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2 sm:py-3 px-2 sm:px-6 text-left">
                            <div className="flex items-center">
                              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">{getBookTitle(borrow.bookId)}</span>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden sm:table-cell">
                            {formatDate(borrow.borrowDate)}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-6 text-left">
                            <span className="text-red-600 font-medium">
                              {formatDate(borrow.dueDate)}
                            </span>
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-6 text-center">
                            <span className="bg-red-100 text-red-800 py-1 px-2 rounded-full text-xs">
                              Overdue
                            </span>
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-6 text-center">
                            <button
                              onClick={() => handleReturn(borrow.id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                            >
                              Return Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'fines' && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Outstanding Fines</h2>
              
              {/* Total Fines Summary */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex items-center">
                  <DollarSign className="text-amber-600 h-8 w-8 sm:h-10 sm:w-10 mr-3 sm:mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-amber-800">Total Fines Due</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-900">${totalFines.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {userFines.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">You have no outstanding fines.</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm leading-normal">
                          <th className="py-2 sm:py-3 px-2 sm:px-6 text-left">Book Title</th>
                          <th className="py-2 sm:py-3 px-2 sm:px-6 text-left">Fine Type</th>
                          <th className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden sm:table-cell">Date Created</th>
                          <th className="py-2 sm:py-3 px-2 sm:px-6 text-right">Amount</th>
                          <th className="py-2 sm:py-3 px-2 sm:px-6 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-xs sm:text-sm">
                        {userFines.map(fine => (
                          <tr key={fine.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-2 sm:py-3 px-2 sm:px-6 text-left">
                              <div className="flex items-center">
                                <Book className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 mr-1 sm:mr-2 flex-shrink-0" />
                                <span className="truncate">{getBookTitle(fine.bookId)}</span>
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-6 text-left">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                fine.reason === 'borrow' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {fine.reason === 'borrow' ? 'Book Price' : 'Overdue Fine'}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-6 text-left hidden sm:table-cell">
                              {formatDate(fine.createdAt)}
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-6 text-right font-medium text-amber-600">
                              ${fine.amount.toFixed(2)}
                            </td>
                            <td className="py-2 sm:py-3 px-2 sm:px-6 text-center">
                              <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs">
                                Pending
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Fine Information</h4>
                    <ul className="text-xs sm:text-sm text-blue-600 space-y-1">
                      <li>• <strong>Book Price:</strong> Charged when you borrow a book, refunded when returned on time</li>
                      <li>• <strong>Overdue Fine:</strong> 25% of book price charged for late returns</li>
                      <li>• Contact the library admin to resolve payment issues</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b">
              <h3 className="text-sm sm:text-lg font-semibold truncate pr-2">{selectedBook.title}</h3>
              <button
                onClick={() => setShowPdfViewer(false)}
                className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl p-1"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <div className="flex-1 p-2 sm:p-4">
              <iframe
                src={selectedBook.pdfFile}
                className="w-full h-full border-0 rounded"
                title={`${selectedBook.title} PDF`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
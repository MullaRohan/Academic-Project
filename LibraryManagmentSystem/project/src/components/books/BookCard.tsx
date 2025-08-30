import { Book } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';
import { useBooks } from '../../context/BookContext';
import { FileText, Eye, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { user } = useAuth();
  const { borrowBook, borrowedBooks } = useBooks();
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [isUserVerified, setIsUserVerified] = useState(false);

  // Check if user is verified
  useEffect(() => {
    const checkVerificationStatus = () => {
      if (user?.role === 'admin') {
        setIsUserVerified(true);
        return;
      }

      if (user?.role === 'user' && user?.id) {
        // Check from Supabase user data first
        if (user.verificationStatus === 'verified') {
          setIsUserVerified(true);
          return;
        }

        // Fallback: Check from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userRecord = registeredUsers.find((u: any) => u.id === user.id || u.email === user.email);
        
        if (userRecord?.verificationStatus === 'verified') {
          setIsUserVerified(true);
          return;
        }

        // Check verification data directly
        const verificationData = localStorage.getItem(`verification_${user.id}`);
        if (verificationData) {
          const data = JSON.parse(verificationData);
          if (data.status === 'verified') {
            setIsUserVerified(true);
            return;
          }
        }

        setIsUserVerified(false);
      } else {
        setIsUserVerified(false);
      }
    };

    checkVerificationStatus();
  }, [user]);

  // Check if this book is already borrowed by the current user
  const isBookBorrowedByUser = borrowedBooks.some(
    borrow => borrow.bookId === book.id && 
    borrow.userId === user?.id && 
    borrow.status === 'borrowed'
  );

  const handleBorrow = () => {
    if (user && !isBookBorrowedByUser && book.status !== 'stockOut' && isUserVerified) {
      borrowBook(user.id, book.id);
    }
  };

  const handleReadPdf = () => {
    if (book.pdfFile && isUserVerified) {
      setShowPdfViewer(true);
    }
  };

  const renderButton = () => {
    // If user is not verified, show verification required message
    if (user?.role === 'user' && !isUserVerified) {
      return (
        <div className="mt-3">
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 px-3 sm:px-4 rounded-lg cursor-not-allowed mb-2 flex items-center justify-center text-sm"
          >
            <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Verification Required
          </button>
          <p className="text-xs text-gray-500 text-center px-1">
            Please verify your student card in "My Account" to borrow books
          </p>
        </div>
      );
    }

    // Only show "Stock Out" if admin has manually set it to stockOut
    if (book.status === 'stockOut') {
      return (
        <button
          disabled
          className="mt-3 w-full bg-gray-300 text-gray-500 py-2 px-3 sm:px-4 rounded-lg cursor-not-allowed text-sm"
        >
          Stock Out
        </button>
      );
    }

    if (book.status === 'comingSoon') {
      return (
        <button
          disabled
          className="mt-3 w-full bg-blue-300 text-white py-2 px-3 sm:px-4 rounded-lg cursor-not-allowed text-sm"
        >
          Coming Soon
        </button>
      );
    }

    if (isBookBorrowedByUser) {
      return (
        <button
          disabled
          className="mt-3 w-full bg-gray-300 text-gray-500 py-2 px-3 sm:px-4 rounded-lg cursor-not-allowed text-sm"
        >
          Already Borrowed
        </button>
      );
    }

    return (
      <button
        onClick={handleBorrow}
        className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 sm:px-4 rounded-lg transition-colors duration-300 text-sm"
      >
        Borrow Now
      </button>
    );
  };

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

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="h-40 sm:h-48 lg:h-52 overflow-hidden">
          <img 
            src={book.coverImage} 
            alt={`Cover of ${book.title}`} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800 mb-1 truncate" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate" title={`by ${book.author}`}>
            by {book.author}
          </p>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-amber-600 mb-2">
            ${book.price.toFixed(2)}
          </p>
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-3 space-y-2 xs:space-y-0">
            <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full truncate max-w-full">
              {book.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(book.status)}`}>
              {book.status === 'available' ? 'Available' : book.status === 'stockOut' ? 'Stock Out' : 'Coming Soon'}
            </span>
          </div>
          
          {/* PDF Read Button */}
          {book.pdfFile && user?.role === 'user' && isBookBorrowedByUser && isUserVerified && (
            <button
              onClick={handleReadPdf}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 sm:px-4 rounded-lg transition-colors duration-300 mb-2 flex items-center justify-center text-sm"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Read Book
            </button>
          )}
          
          {/* PDF Indicator */}
          {book.pdfFile && (
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 mr-1" />
              <span className="text-xs text-green-600">PDF Available</span>
            </div>
          )}
          
          {user?.role === 'user' && renderButton()}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && book.pdfFile && isUserVerified && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-3 sm:p-4 border-b">
              <h3 className="text-sm sm:text-lg font-semibold truncate pr-2">{book.title}</h3>
              <button
                onClick={() => setShowPdfViewer(false)}
                className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl p-1"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-2 sm:p-4">
              <iframe
                src={book.pdfFile}
                className="w-full h-full border-0 rounded"
                title={`${book.title} PDF`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;
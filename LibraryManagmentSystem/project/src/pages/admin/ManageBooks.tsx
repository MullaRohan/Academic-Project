import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit, Trash2, Plus, BookOpen, FileText } from 'lucide-react';
import { useBooks, Book } from '../../context/BookContext';
import { useLanguage } from '../../context/LanguageContext';

const ManageBooks = () => {
  const { books, updateBook, deleteBook } = useBooks();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState<'available' | 'stockOut' | 'comingSoon'>('available');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'stockOut' | 'comingSoon'>('all');

  // Filter books based on search term and status
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusFilter === 'all' ? matchesSearch : (matchesSearch && book.status === statusFilter);
  });

  // Category options
  const categoryOptions = [
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'History',
    'Biography',
    'Self-Help',
    'Science'
  ];

  // Start editing a book
  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
    setPrice(book.price.toString());
    setStatus(book.status);
  };

  // Save edited book
  const handleSaveEdit = () => {
    if (!editingBook) return;
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      alert('Please enter a valid price');
      return;
    }
    
    updateBook(editingBook.id, {
      title,
      author,
      category,
      price: priceNum,
      status
    });
    
    setEditingBook(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  // Delete a book
  const handleDeleteBook = (bookId: string) => {
    if (window.confirm(t('confirmDelete'))) {
      deleteBook(bookId);
    }
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
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-amber-600 text-white p-6">
        <h1 className="text-2xl font-bold">{t('bookManagement')}</h1>
        <p className="text-amber-100">{t('manageBooks')}</p>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            >
              <option value="all">{t('allBooks')}</option>
              <option value="available">{t('available')}</option>
              <option value="stockOut">{t('stockOut')}</option>
              <option value="comingSoon">{t('comingSoon')}</option>
            </select>
          </div>
          
          <Link
            to="/admin/books/add"
            className="flex items-center justify-center sm:justify-start bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('addNewBook')}
          </Link>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">{t('noBooks')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">{t('title')}</th>
                  <th className="py-3 px-6 text-left">{t('author')}</th>
                  <th className="py-3 px-6 text-left">{t('category')}</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-center">{t('status')}</th>
                  <th className="py-3 px-6 text-center">PDF</th>
                  <th className="py-3 px-6 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {filteredBooks.map(book => (
                  <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                    {editingBook?.id === book.id ? (
                      <>
                        <td className="py-3 px-6">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </td>
                        <td className="py-3 px-6">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                          />
                        </td>
                        <td className="py-3 px-6">
                          <select
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            {categoryOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-6">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </td>
                        <td className="py-3 px-6 text-center">
                          <select
                            className="px-2 py-1 border border-gray-300 rounded"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'available' | 'stockOut' | 'comingSoon')}
                          >
                            <option value="available">{t('available')}</option>
                            <option value="stockOut">{t('stockOut')}</option>
                            <option value="comingSoon">{t('comingSoon')}</option>
                          </select>
                        </td>
                        <td className="py-3 px-6 text-center">
                          {book.pdfFile ? (
                            <FileText className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-gray-400">No PDF</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded mr-2"
                          >
                            {t('save')}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded"
                          >
                            {t('cancel')}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-6 text-left">
                          <div className="flex items-center">
                            <div className="mr-2">
                              <BookOpen className="h-5 w-5 text-amber-500" />
                            </div>
                            <span>{book.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-left">{book.author}</td>
                        <td className="py-3 px-6 text-left">{book.category}</td>
                        <td className="py-3 px-6 text-left">${book.price.toFixed(2)}</td>
                        <td className="py-3 px-6 text-center">
                          <span className={`py-1 px-3 rounded-full text-xs ${getStatusColor(book.status)}`}>
                            {t(book.status)}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          {book.pdfFile ? (
                            <FileText className="h-5 w-5 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-gray-400">No PDF</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <button
                              onClick={() => handleEditClick(book)}
                              className="transform hover:text-amber-500 hover:scale-110 transition-all duration-200 mr-3"
                              title={t('edit')}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="transform hover:text-red-500 hover:scale-110 transition-all duration-200"
                              title={t('delete')}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </>
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

export default ManageBooks;
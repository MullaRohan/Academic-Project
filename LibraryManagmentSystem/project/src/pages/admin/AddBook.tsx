import { useState, useRef } from 'react';
import { Book, User, BookText, Tag, Upload, FileText, DollarSign } from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const { addBook } = useBooks();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [pdfFile, setPdfFile] = useState('');
  const [status, setStatus] = useState<'available' | 'stockOut'>('available');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get existing authors and categories from localStorage
  const savedAuthors = JSON.parse(localStorage.getItem('authors') || '[]');
  const savedCategories = JSON.parse(localStorage.getItem('categories') || '[]');

  // Extract unique author names and category names for dropdown
  const authorOptions = savedAuthors.map((a: any) => a.name);
  const categoryOptions = savedCategories.map((c: any) => c.name);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfFile(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to auto-save new author
  const saveNewAuthor = (authorName: string) => {
    const existingAuthor = savedAuthors.find((a: any) => a.name.toLowerCase() === authorName.toLowerCase());
    if (!existingAuthor) {
      const newAuthor = {
        id: Date.now().toString(),
        name: authorName,
        email: '', // Default empty email
        bio: `Author of ${title}` // Auto-generated bio
      };
      const updatedAuthors = [...savedAuthors, newAuthor];
      localStorage.setItem('authors', JSON.stringify(updatedAuthors));
    }
  };

  // Function to auto-save new category
  const saveNewCategory = (categoryName: string) => {
    const existingCategory = savedCategories.find((c: any) => c.name.toLowerCase() === categoryName.toLowerCase());
    if (!existingCategory) {
      const newCategory = {
        id: Date.now().toString(),
        name: categoryName,
        description: `Books in ${categoryName} category` // Auto-generated description
      };
      const updatedCategories = [...savedCategories, newCategory];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      // Simple validation
      if (!title || !author || !category || !price) {
        setError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        setError('Please enter a valid price');
        setIsSubmitting(false);
        return;
      }

      // Use default image if none provided
      const finalCoverImage = coverImage || 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg';
      
      // Auto-save new author and category if they don't exist
      saveNewAuthor(author);
      saveNewCategory(category);
      
      console.log('Submitting book:', {
        title,
        author,
        category,
        price: priceNum,
        coverImage: finalCoverImage,
        pdfFile,
        status
      });
      
      // Add new book
      const { error: addError } = await addBook({
        title,
        author,
        category,
        price: priceNum,
        coverImage: finalCoverImage,
        pdfFile,
        status
      });
      
      if (addError) {
        console.error('Error adding book:', addError);
        setError('Failed to add book. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      setSuccess('Book added successfully! New author and category have been saved automatically.');
      
      // Reset form after success
      setTitle('');
      setAuthor('');
      setCategory('');
      setPrice('');
      setCoverImage('');
      setPdfFile('');
      setStatus('available');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
      
      // Navigate to manage books after short delay
      setTimeout(() => {
        navigate('/admin/books/manage');
      }, 2000);
      
    } catch (error) {
      console.error('Error adding book:', error);
      setError('Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-amber-600 text-white p-6">
        <h1 className="text-2xl font-bold">Add New Book</h1>
        <p className="text-amber-100">Add a new book to the library collection</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                Book Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Book className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter book title"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
                Author *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="author"
                  type="text"
                  placeholder="Enter author name (will be auto-saved if new)"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  list="authors-list"
                  disabled={isSubmitting}
                  required
                />
                <datalist id="authors-list">
                  {authorOptions.map(authorName => (
                    <option key={authorName} value={authorName} />
                  ))}
                </datalist>
              </div>
              {authorOptions.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Existing authors: {authorOptions.slice(0, 3).join(', ')}{authorOptions.length > 3 ? '...' : ''}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                Category *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BookText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="category"
                  type="text"
                  placeholder="Enter category (will be auto-saved if new)"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  list="categories-list"
                  disabled={isSubmitting}
                  required
                />
                <datalist id="categories-list">
                  {categoryOptions.map(categoryName => (
                    <option key={categoryName} value={categoryName} />
                  ))}
                </datalist>
              </div>
              {categoryOptions.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Existing categories: {categoryOptions.slice(0, 2).join(', ')}{categoryOptions.length > 2 ? '...' : ''}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="status"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'available' | 'stockOut')}
                  disabled={isSubmitting}
                >
                  <option value="available">Available</option>
                  <option value="stockOut">Stock Out</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cover Image (Optional)
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <div className="flex flex-col items-center">
                  {coverImage ? (
                    <div className="relative">
                      <img
                        src={coverImage}
                        alt="Book cover preview"
                        className="h-40 w-auto object-cover mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage('');
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                </div>
                {!isSubmitting && (
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="cover-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="cover-upload"
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isSubmitting}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB. Default image will be used if none provided.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Book PDF (Optional)
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <div className="flex flex-col items-center">
                  {pdfFile ? (
                    <div className="relative">
                      <div className="flex items-center justify-center w-40 h-20 bg-red-100 rounded-lg mb-4">
                        <FileText className="h-8 w-8 text-red-600" />
                        <span className="ml-2 text-sm text-red-600">PDF Uploaded</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile('');
                          if (pdfInputRef.current) {
                            pdfInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                </div>
                {!isSubmitting && (
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="pdf-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                    >
                      <span>Upload PDF file</span>
                      <input
                        id="pdf-upload"
                        ref={pdfInputRef}
                        type="file"
                        className="sr-only"
                        accept=".pdf"
                        onChange={handlePdfChange}
                        disabled={isSubmitting}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  PDF files only, up to 50MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Auto-Save Feature</h3>
            <p className="text-sm text-blue-600">
              When you add a new book, any new author or category will be automatically saved to the Authors and Categories sections. 
              You can manage them later from their respective pages.
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/books/manage')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
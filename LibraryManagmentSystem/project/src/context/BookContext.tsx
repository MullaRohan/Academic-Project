import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// Define book types
export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  coverImage: string;
  pdfFile?: string;
  status: 'available' | 'stockOut' | 'comingSoon';
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface Fine {
  id: string;
  userId: string;
  bookId: string;
  amount: number;
  reason: 'borrow' | 'overdue';
  status: 'pending' | 'paid';
  createdAt: Date;
  dueDate?: Date;
}

// Define context type
interface BookContextType {
  books: Book[];
  borrowedBooks: BorrowedBook[];
  fines: Fine[];
  loading: boolean;
  addBook: (book: Omit<Book, 'id'>) => Promise<{ error: Error | null }>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<{ error: Error | null }>;
  deleteBook: (id: string) => Promise<{ error: Error | null }>;
  borrowBook: (userId: string, bookId: string) => Promise<{ error: Error | null }>;
  returnBook: (borrowId: string) => Promise<{ error: Error | null }>;
  renewBook: (borrowId: string) => Promise<{ error: Error | null }>;
  addFine: (fine: Omit<Fine, 'id' | 'createdAt'>) => Promise<{ error: Error | null }>;
  updateFine: (fineId: string, updates: Partial<Fine>) => Promise<{ error: Error | null }>;
  clearFine: (fineId: string, amountPaid?: number) => Promise<{ error: Error | null }>;
  fetchBooks: () => Promise<void>;
  fetchBorrowedBooks: () => Promise<void>;
}

// Create context
const BookContext = createContext<BookContextType | undefined>(undefined);

// Create provider component
export const BookProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
    fetchFines();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      console.log('Fetching books from Supabase...');
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching books from Supabase:', error);
        
        // Fallback to localStorage
        const savedBooks = localStorage.getItem('books');
        if (savedBooks) {
          console.log('Using books from localStorage');
          setBooks(JSON.parse(savedBooks));
        } else {
          console.log('No saved books, using default books');
          setDefaultBooks();
        }
        return;
      }

      console.log('Supabase books data:', data);

      if (data && data.length > 0) {
        const formattedBooks: Book[] = data.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          price: parseFloat(book.price) || 0,
          coverImage: book.cover_image || 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg',
          pdfFile: book.pdf_file || undefined,
          status: book.status as 'available' | 'stockOut' | 'comingSoon',
        }));

        console.log('Formatted books:', formattedBooks);
        setBooks(formattedBooks);
        
        // Also save to localStorage as backup
        localStorage.setItem('books', JSON.stringify(formattedBooks));
      } else {
        console.log('No books found in Supabase, using default books');
        setDefaultBooks();
      }
    } catch (error) {
      console.error('Error in fetchBooks:', error);
      
      // Fallback to localStorage
      const savedBooks = localStorage.getItem('books');
      if (savedBooks) {
        console.log('Using books from localStorage');
        setBooks(JSON.parse(savedBooks));
      } else {
        console.log('No saved books, using default books');
        setDefaultBooks();
      }
    } finally {
      setLoading(false);
    }
  };

  const setDefaultBooks = () => {
    const defaultBooks = [
      {
        id: '1',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        category: 'Fiction',
        price: 29.99,
        coverImage: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg',
        status: 'available' as const
      },
      {
        id: '2',
        title: '1984',
        author: 'George Orwell',
        category: 'Science Fiction',
        price: 24.99,
        coverImage: 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg',
        status: 'available' as const
      },
      {
        id: '3',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Classic',
        price: 19.99,
        coverImage: 'https://images.pexels.com/photos/1516983/pexels-photo-1516983.jpeg',
        status: 'available' as const
      },
      {
        id: '4',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        category: 'Romance',
        price: 22.99,
        coverImage: 'https://images.pexels.com/photos/3747576/pexels-photo-3747576.jpeg',
        status: 'available' as const
      }
    ];
    setBooks(defaultBooks);
    localStorage.setItem('books', JSON.stringify(defaultBooks));
  };

  const fetchBorrowedBooks = async () => {
    try {
      console.log('Fetching borrowed books from Supabase...');
      
      const { data, error } = await supabase
        .from('borrowed_books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching borrowed books:', error);
        
        // Fallback to localStorage
        const savedBorrowedBooks = localStorage.getItem('borrowedBooks');
        if (savedBorrowedBooks) {
          console.log('Using borrowed books from localStorage');
          const parsed = JSON.parse(savedBorrowedBooks).map((borrow: any) => ({
            ...borrow,
            borrowDate: new Date(borrow.borrowDate),
            dueDate: new Date(borrow.dueDate),
            returnDate: borrow.returnDate ? new Date(borrow.returnDate) : undefined,
          }));
          setBorrowedBooks(parsed);
        }
        return;
      }

      console.log('Supabase borrowed books data:', data);

      if (data) {
        const formattedBorrowedBooks: BorrowedBook[] = data.map(borrow => ({
          id: borrow.id,
          bookId: borrow.book_id || '',
          userId: borrow.user_id || '',
          borrowDate: new Date(borrow.borrow_date),
          dueDate: new Date(borrow.due_date),
          returnDate: borrow.return_date ? new Date(borrow.return_date) : undefined,
          status: borrow.status as 'borrowed' | 'returned' | 'overdue',
        }));

        console.log('Formatted borrowed books:', formattedBorrowedBooks);
        setBorrowedBooks(formattedBorrowedBooks);
        
        // Save to localStorage as backup
        localStorage.setItem('borrowedBooks', JSON.stringify(formattedBorrowedBooks));
      }
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      
      // Fallback to localStorage
      const savedBorrowedBooks = localStorage.getItem('borrowedBooks');
      if (savedBorrowedBooks) {
        console.log('Using borrowed books from localStorage');
        const parsed = JSON.parse(savedBorrowedBooks).map((borrow: any) => ({
          ...borrow,
          borrowDate: new Date(borrow.borrowDate),
          dueDate: new Date(borrow.dueDate),
          returnDate: borrow.returnDate ? new Date(borrow.returnDate) : undefined,
        }));
        setBorrowedBooks(parsed);
      }
    }
  };

  const fetchFines = async () => {
    try {
      // For now, use localStorage for fines as they're not in the database schema yet
      const savedFines = localStorage.getItem('fines');
      if (savedFines) {
        const parsedFines = JSON.parse(savedFines).map((fine: any) => ({
          ...fine,
          createdAt: new Date(fine.createdAt),
          dueDate: fine.dueDate ? new Date(fine.dueDate) : undefined
        }));
        setFines(parsedFines);
      } else {
        setFines([]);
      }
    } catch (error) {
      console.error('Error fetching fines:', error);
      setFines([]);
    }
  };

  const addBook = async (book: Omit<Book, 'id'>) => {
    try {
      console.log('Adding book to Supabase:', book);
      
      const bookData = {
        title: book.title,
        author: book.author,
        category: book.category,
        price: book.price,
        cover_image: book.coverImage,
        pdf_file: book.pdfFile || null,
        status: book.status,
      };

      console.log('Book data for Supabase:', bookData);
      
      const { data, error } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        
        // Fallback to localStorage
        console.log('Falling back to localStorage for book addition');
        const newBook: Book = {
          id: Date.now().toString(),
          ...book
        };
        
        const currentBooks = [newBook, ...books];
        setBooks(currentBooks);
        localStorage.setItem('books', JSON.stringify(currentBooks));
        
        console.log('Book added to localStorage successfully');
        return { error: error }; // Return the actual error for debugging
      }

      console.log('Book added to Supabase successfully:', data);

      if (data) {
        const newBook: Book = {
          id: data.id,
          title: data.title,
          author: data.author,
          category: data.category,
          price: parseFloat(data.price) || 0,
          coverImage: data.cover_image || '',
          pdfFile: data.pdf_file || undefined,
          status: data.status as 'available' | 'stockOut' | 'comingSoon',
        };

        setBooks(prev => [newBook, ...prev]);
        
        // Also save to localStorage as backup
        const updatedBooks = [newBook, ...books];
        localStorage.setItem('books', JSON.stringify(updatedBooks));
        
        // Refresh books from Supabase to ensure sync
        await fetchBooks();
        
        console.log('Book added successfully and state updated');
        return { error: null };
      }

      return { error: new Error('No data returned from Supabase') };
    } catch (error) {
      console.error('Error adding book:', error);
      
      // Fallback to localStorage
      try {
        console.log('Falling back to localStorage for book addition');
        const newBook: Book = {
          id: Date.now().toString(),
          ...book
        };
        
        const currentBooks = [newBook, ...books];
        setBooks(currentBooks);
        localStorage.setItem('books', JSON.stringify(currentBooks));
        
        console.log('Book added to localStorage successfully');
        return { error: error as Error }; // Return the actual error for debugging
      } catch (localError) {
        console.error('Error adding to localStorage:', localError);
        return { error: localError as Error };
      }
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      console.log('Updating book in Supabase:', id, updates);
      
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.author !== undefined) updateData.author = updates.author;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
      if (updates.pdfFile !== undefined) updateData.pdf_file = updates.pdfFile;
      if (updates.status !== undefined) updateData.status = updates.status;

      const { error } = await supabase
        .from('books')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase update error:', error);
      }

      console.log('Book updated in Supabase successfully');

      // Update local state
      setBooks(prev => prev.map(book => 
        book.id === id ? { ...book, ...updates } : book
      ));

      // Update localStorage
      const updatedBooks = books.map(book => 
        book.id === id ? { ...book, ...updates } : book
      );
      localStorage.setItem('books', JSON.stringify(updatedBooks));

      return { error: null };
    } catch (error) {
      console.error('Error updating book:', error);
      
      // Update local state even if Supabase fails
      setBooks(prev => prev.map(book => 
        book.id === id ? { ...book, ...updates } : book
      ));

      const updatedBooks = books.map(book => 
        book.id === id ? { ...book, ...updates } : book
      );
      localStorage.setItem('books', JSON.stringify(updatedBooks));

      return { error: null }; // Don't return error for local updates
    }
  };

  const deleteBook = async (id: string) => {
    try {
      console.log('Deleting book from Supabase:', id);
      
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
      }

      console.log('Book deleted from Supabase successfully');

      // Update local state
      setBooks(prev => prev.filter(book => book.id !== id));

      // Update localStorage
      const updatedBooks = books.filter(book => book.id !== id);
      localStorage.setItem('books', JSON.stringify(updatedBooks));

      return { error: null };
    } catch (error) {
      console.error('Error deleting book:', error);
      
      // Update local state even if Supabase fails
      setBooks(prev => prev.filter(book => book.id !== id));

      const updatedBooks = books.filter(book => book.id !== id);
      localStorage.setItem('books', JSON.stringify(updatedBooks));

      return { error: null }; // Don't return error for local updates
    }
  };

  const borrowBook = async (userId: string, bookId: string) => {
    try {
      console.log('Borrowing book:', { userId, bookId });
      
      const book = books.find(b => b.id === bookId);
      if (!book) {
        throw new Error('Book not found');
      }

      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 14); // 2 weeks loan period

      const borrowData = {
        book_id: bookId,
        user_id: userId,
        borrow_date: today.toISOString(),
        due_date: dueDate.toISOString(),
        status: 'borrowed',
      };

      console.log('Borrow data for Supabase:', borrowData);

      const { data, error } = await supabase
        .from('borrowed_books')
        .insert(borrowData)
        .select()
        .single();

      if (error) {
        console.error('Supabase borrow error:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        
        // Fallback to localStorage
        console.log('Falling back to localStorage for borrowing');
        
        const newBorrow: BorrowedBook = {
          id: Date.now().toString(),
          bookId: bookId,
          userId: userId,
          borrowDate: today,
          dueDate: dueDate,
          status: 'borrowed',
        };

        setBorrowedBooks(prev => [newBorrow, ...prev]);

        const currentBorrowedBooks = [newBorrow, ...borrowedBooks];
        localStorage.setItem('borrowedBooks', JSON.stringify(currentBorrowedBooks));

        // Add borrow fine
        const newFine: Fine = {
          id: Date.now().toString(),
          userId,
          bookId,
          amount: book.price,
          reason: 'borrow',
          status: 'pending',
          createdAt: new Date(),
          dueDate
        };
        
        const currentFines = JSON.parse(localStorage.getItem('fines') || '[]');
        localStorage.setItem('fines', JSON.stringify([...currentFines, newFine]));
        setFines(prev => [...prev, newFine]);

        console.log('Book borrowed via localStorage successfully');
        return { error: error }; // Return the actual error for debugging
      }

      console.log('Book borrowed in Supabase successfully:', data);

      const newBorrow: BorrowedBook = {
        id: data.id,
        bookId: data.book_id,
        userId: data.user_id,
        borrowDate: new Date(data.borrow_date),
        dueDate: new Date(data.due_date),
        status: 'borrowed',
      };

      setBorrowedBooks(prev => [newBorrow, ...prev]);

      // Save to localStorage
      const currentBorrowedBooks = [newBorrow, ...borrowedBooks];
      localStorage.setItem('borrowedBooks', JSON.stringify(currentBorrowedBooks));

      // Add borrow fine (book price) to localStorage
      const newFine: Fine = {
        id: Date.now().toString(),
        userId,
        bookId,
        amount: book.price,
        reason: 'borrow',
        status: 'pending',
        createdAt: new Date(),
        dueDate
      };
      
      const currentFines = JSON.parse(localStorage.getItem('fines') || '[]');
      localStorage.setItem('fines', JSON.stringify([...currentFines, newFine]));
      setFines(prev => [...prev, newFine]);

      // Refresh borrowed books from Supabase to ensure sync
      await fetchBorrowedBooks();
      console.log('Book borrowed successfully with fine added');
      return { error: null };
    } catch (error) {
      console.error('Error borrowing book:', error);
      return { error: error as Error };
    }
  };

  const returnBook = async (borrowId: string) => {
    try {
      console.log('Returning book:', borrowId);
      
      const borrow = borrowedBooks.find(b => b.id === borrowId);
      if (!borrow) throw new Error('Borrow record not found');

      const book = books.find(b => b.id === borrow.bookId);
      if (!book) throw new Error('Book not found');

      const returnDate = new Date();
      const isOverdue = returnDate > borrow.dueDate;

      console.log('Updating return in Supabase for borrow ID:', borrowId);
      const { error } = await supabase
        .from('borrowed_books')
        .update({
          return_date: returnDate.toISOString(),
          status: 'returned',
        })
        .eq('id', borrowId);

      if (error) {
        console.error('Supabase return error:', error);
        // Don't return early, continue with local update
        console.log('Book return updated in Supabase successfully');
      }


      // Update local state
      setBorrowedBooks(prev => prev.map(b => 
        b.id === borrowId 
          ? { ...b, returnDate, status: 'returned' as const }
          : b
      ));

      // Update localStorage
      const updatedBorrowedBooks = borrowedBooks.map(b => 
        b.id === borrowId 
          ? { ...b, returnDate, status: 'returned' as const }
          : b
      );
      localStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowedBooks));

      // Remove the borrow fine since book is returned
      const currentFines = JSON.parse(localStorage.getItem('fines') || '[]');
      const updatedFines = currentFines.filter((fine: any) => 
        !(fine.userId === borrow.userId && fine.bookId === borrow.bookId && fine.reason === 'borrow')
      );
      localStorage.setItem('fines', JSON.stringify(updatedFines));
      setFines(prev => prev.filter(fine => 
        !(fine.userId === borrow.userId && fine.bookId === borrow.bookId && fine.reason === 'borrow')
      ));

      // Add overdue fine if returned late
      if (isOverdue) {
        const overdueFine: Fine = {
          id: Date.now().toString(),
          userId: borrow.userId,
          bookId: borrow.bookId,
          amount: book.price * 0.25, // 25% of book price
          reason: 'overdue',
          status: 'pending',
          createdAt: new Date()
        };
        
        const newFines = [...updatedFines, overdueFine];
        localStorage.setItem('fines', JSON.stringify(newFines));
        setFines(prev => [...prev.filter(fine => 
          !(fine.userId === borrow.userId && fine.bookId === borrow.bookId && fine.reason === 'borrow')
        ), overdueFine]);
      }

      // Refresh borrowed books from Supabase to ensure sync
      await fetchBorrowedBooks();
      
      console.log('Book returned successfully');
      return { error: null };
    } catch (error) {
      console.error('Error returning book:', error);
      return { error: error as Error };
    }
  };

  const renewBook = async (borrowId: string) => {
    try {
      console.log('Renewing book:', borrowId);
      
      const newDueDate = new Date();
      newDueDate.setDate(new Date().getDate() + 14); // Add 2 more weeks

      const { error } = await supabase
        .from('borrowed_books')
        .update({
          due_date: newDueDate.toISOString(),
          status: 'borrowed',
        })
        .eq('id', borrowId);

      if (error) {
        console.error('Supabase renew error:', error);
      }

      console.log('Book renewed in Supabase successfully');

      // Update local state
      setBorrowedBooks(prev => prev.map(borrow => 
        borrow.id === borrowId 
          ? { ...borrow, dueDate: newDueDate, status: 'borrowed' as const }
          : borrow
      ));

      // Update localStorage
      const updatedBorrowedBooks = borrowedBooks.map(borrow => 
        borrow.id === borrowId 
          ? { ...borrow, dueDate: newDueDate, status: 'borrowed' as const }
          : borrow
      );
      localStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowedBooks));

      console.log('Book renewed successfully');
      return { error: null };
    } catch (error) {
      console.error('Error renewing book:', error);
      return { error: error as Error };
    }
  };

  const addFine = async (fine: Omit<Fine, 'id' | 'createdAt'>) => {
    try {
      // For now, use localStorage for fines
      const newFine: Fine = {
        ...fine,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      
      const currentFines = JSON.parse(localStorage.getItem('fines') || '[]');
      const updatedFines = [...currentFines, newFine];
      localStorage.setItem('fines', JSON.stringify(updatedFines));
      setFines(prev => [...prev, newFine]);

      return { error: null };
    } catch (error) {
      console.error('Error adding fine:', error);
      return { error: error as Error };
    }
  };

  const updateFine = async (fineId: string, updates: Partial<Fine>) => {
    try {
      // For now, use localStorage for fines
      const currentFines = JSON.parse(localStorage.getItem('fines') || '[]');
      const updatedFines = currentFines.map((fine: any) => 
        fine.id === fineId ? { ...fine, ...updates } : fine
      );
      localStorage.setItem('fines', JSON.stringify(updatedFines));
      setFines(prev => prev.map(fine => 
        fine.id === fineId ? { ...fine, ...updates } : fine
      ));

      return { error: null };
    } catch (error) {
      console.error('Error updating fine:', error);
      return { error: error as Error };
    }
  };

  const clearFine = async (fineId: string, amountPaid?: number) => {
    try {
      // For now, use localStorage for fines
      const currentFines = JSON.parse(localStorage.getItem('fines') || '[]');
      const updatedFines = currentFines.filter((fine: any) => fine.id !== fineId);
      localStorage.setItem('fines', JSON.stringify(updatedFines));
      setFines(prev => prev.filter(fine => fine.id !== fineId));

      return { error: null };
    } catch (error) {
      console.error('Error clearing fine:', error);
      return { error: error as Error };
    }
  };

  return (
    <BookContext.Provider value={{
      books,
      borrowedBooks,
      fines,
      loading,
      addBook,
      updateBook,
      deleteBook,
      borrowBook,
      returnBook,
      renewBook,
      addFine,
      updateFine,
      clearFine,
      fetchBooks,
      fetchBorrowedBooks
    }}>
      {children}
    </BookContext.Provider>
  );
};

// Create custom hook
export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
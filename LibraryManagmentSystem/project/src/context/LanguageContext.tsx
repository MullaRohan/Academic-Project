import { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

const translations: Translations = {
  // Navigation
  home: {
    en: 'Home',
    bn: 'হোম'
  },
  dashboard: {
    en: 'Dashboard',
    bn: 'ড্যাশবোর্ড'
  },
  userManagement: {
    en: 'User Management',
    bn: 'ব্যবহারকারী ব্যবস্থাপনা'
  },
  bookManagement: {
    en: 'Book Management',
    bn: 'বই ব্যবস্থাপনা'
  },
  manageBooks: {
    en: 'Manage library collection',
    bn: 'লাইব্রেরি সংগ্রহ পরিচালনা করুন'
  },
  availableBooks: {
    en: 'Available Books',
    bn: 'উপলব্ধ বই'
  },
  myAccount: {
    en: 'My Account',
    bn: 'আমার অ্যাকাউন্ট'
  },
  logout: {
    en: 'Logout',
    bn: 'লগআউট'
  },

  // Auth
  login: {
    en: 'Login',
    bn: 'লগইন'
  },
  register: {
    en: 'Register',
    bn: 'নিবন্ধন'
  },
  email: {
    en: 'Email',
    bn: 'ইমেইল'
  },
  password: {
    en: 'Password',
    bn: 'পাসওয়ার্ড'
  },
  confirmPassword: {
    en: 'Confirm Password',
    bn: 'পাসওয়ার্ড নিশ্চিত করুন'
  },
  fullName: {
    en: 'Full Name',
    bn: 'পূর্ণ নাম'
  },

  // Book Status
  available: {
    en: 'Available',
    bn: 'উপলব্ধ'
  },
  stockOut: {
    en: 'Stock Out',
    bn: 'স্টক আউট'
  },
  comingSoon: {
    en: 'Coming Soon',
    bn: 'শীঘ্রই আসছে'
  },
  borrowNow: {
    en: 'Borrow Now',
    bn: 'ধার করুন'
  },
  alreadyBorrowed: {
    en: 'Already Borrowed',
    bn: 'ইতিমধ্যে ধার করা হয়েছে'
  },

  // Book Details
  by: {
    en: 'by',
    bn: 'দ্বারা'
  },
  author: {
    en: 'Author',
    bn: 'লেখক'
  },
  category: {
    en: 'Category',
    bn: 'বিভাগ'
  },
  title: {
    en: 'Title',
    bn: 'শিরোনাম'
  },
  status: {
    en: 'Status',
    bn: 'অবস্থা'
  },
  actions: {
    en: 'Actions',
    bn: 'কার্যক্রম'
  },
  allBooks: {
    en: 'All Books',
    bn: 'সকল বই'
  },
  addNewBook: {
    en: 'Add New Book',
    bn: 'নতুন বই যোগ করুন'
  },

  // Actions
  edit: {
    en: 'Edit',
    bn: 'সম্পাদনা'
  },
  save: {
    en: 'Save',
    bn: 'সংরক্ষণ'
  },
  cancel: {
    en: 'Cancel',
    bn: 'বাতিল'
  },
  delete: {
    en: 'Delete',
    bn: 'মুছে ফেলুন'
  },
  search: {
    en: 'Search',
    bn: 'অনুসন্ধান'
  },
  add: {
    en: 'Add',
    bn: 'যোগ করুন'
  },
  confirmDelete: {
    en: 'Are you sure you want to delete this book?',
    bn: 'আপনি কি নিশ্চিত যে আপনি এই বইটি মুছে ফেলতে চান?'
  },

  // Messages
  welcome: {
    en: 'Welcome',
    bn: 'স্বাগতম'
  },
  welcomeMessage: {
    en: 'Discover, borrow and enjoy a vast collection of books. Join our community of readers today!',
    bn: 'বইয়ের একটি বিশাল সংগ্রহ আবিষ্কার করুন, ধার নিন এবং উপভোগ করুন। আজই আমাদের পাঠক সম্প্রদায়ে যোগ দিন!'
  },
  noBooks: {
    en: 'No books found. Try a different search term or add a new book.',
    bn: 'কোন বই পাওয়া যায়নি। একটি ভিন্ন অনুসন্ধান শব্দ ব্যবহার করুন বা একটি নতুন বই যোগ করুন।'
  },
  searchPlaceholder: {
    en: 'Search books by title, author or category...',
    bn: 'শিরোনাম, লেখক বা বিভাগ দ্বারা বই খুঁজুন...'
  },

  // Dashboard
  totalBooks: {
    en: 'Total Books',
    bn: 'মোট বই'
  },
  currentLoans: {
    en: 'Current Loans',
    bn: 'বর্তমান ঋণ'
  },
  overdueBooks: {
    en: 'Overdue Books',
    bn: 'বিলম্বিত বই'
  },
  activeUsers: {
    en: 'Active Users',
    bn: 'সক্রিয় ব্যবহারকারী'
  },

  // Categories
  fiction: {
    en: 'Fiction',
    bn: 'কল্পকাহিনী'
  },
  nonFiction: {
    en: 'Non-Fiction',
    bn: 'নন-ফিকশন'
  },
  scienceFiction: {
    en: 'Science Fiction',
    bn: 'বিজ্ঞান কল্পকাহিনী'
  },
  fantasy: {
    en: 'Fantasy',
    bn: 'ফ্যান্টাসি'
  },
  mystery: {
    en: 'Mystery',
    bn: 'রহস্য'
  },
  romance: {
    en: 'Romance',
    bn: 'রোমান্স'
  },
  history: {
    en: 'History',
    bn: 'ইতিহাস'
  },
  biography: {
    en: 'Biography',
    bn: 'জীবনী'
  },
  selfHelp: {
    en: 'Self-Help',
    bn: 'আত্ম-উন্নয়ন'
  },
  science: {
    en: 'Science',
    bn: 'বিজ্ঞান'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
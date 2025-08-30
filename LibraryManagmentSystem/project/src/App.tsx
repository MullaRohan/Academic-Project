import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import UserLogin from './pages/auth/UserLogin';
import UserRegister from './pages/auth/UserRegister';
import AdminLogin from './pages/auth/AdminLogin';
import UserDashboard from './pages/user/UserDashboard';
import UserBooks from './pages/user/UserBooks';
import UserAccount from './pages/user/UserAccount';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import UserActivity from './pages/admin/UserActivity';
import AddBook from './pages/admin/AddBook';
import ManageBooks from './pages/admin/ManageBooks';
import Categories from './pages/admin/Categories';
import Authors from './pages/admin/Authors';
import RegisteredStudents from './pages/admin/RegisteredStudents';
import IssueBooks from './pages/admin/IssueBooks';
import VerificationReview from './pages/admin/VerificationReview';
import ChangePassword from './pages/admin/ChangePassword';
import { BookProvider } from './context/BookContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <BookProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  
                  {/* Auth Routes */}
                  <Route path="/user/login" element={<UserLogin />} />
                  <Route path="/user/register" element={<UserRegister />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* User Routes */}
                  <Route path="/user/dashboard" element={
                    <ProtectedRoute role="user">
                      <UserDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/user/books" element={
                    <ProtectedRoute role="user">
                      <UserBooks />
                    </ProtectedRoute>
                  } />
                  <Route path="/user/account" element={
                    <ProtectedRoute role="user">
                      <UserAccount />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute role="admin">
                      <ManageUsers />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/activity" element={
                    <ProtectedRoute role="admin">
                      <UserActivity />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/books/add" element={
                    <ProtectedRoute role="admin">
                      <AddBook />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/books/manage" element={
                    <ProtectedRoute role="admin">
                      <ManageBooks />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <ProtectedRoute role="admin">
                      <Categories />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/authors" element={
                    <ProtectedRoute role="admin">
                      <Authors />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/issue-books" element={
                    <ProtectedRoute role="admin">
                      <IssueBooks />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/students" element={
                    <ProtectedRoute role="admin">
                      <RegisteredStudents />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/verification-review" element={
                    <ProtectedRoute role="admin">
                      <VerificationReview />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/change-password" element={
                    <ProtectedRoute role="admin">
                      <ChangePassword />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </BookProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
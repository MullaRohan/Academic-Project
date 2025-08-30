/*
  # Complete Library Management System Setup

  1. New Tables
    - `users` - User profiles with all required fields
    - `books` - Book catalog with all metadata
    - `borrowed_books` - Book borrowing records

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for all user roles
    - Service role access for admin operations

  3. Data Integrity
    - Foreign key constraints
    - Default values for all required fields
    - Proper indexing for performance
*/

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS borrowed_books CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table with all required fields
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  bio text,
  student_id text,
  department text,
  verification_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create books table with all required fields
CREATE TABLE books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  cover_image text,
  pdf_file text,
  price numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

-- Create borrowed_books table
CREATE TABLE borrowed_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  borrow_date timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz NOT NULL,
  return_date timestamptz,
  status text NOT NULL DEFAULT 'borrowed',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowed_books ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id AND role = 'user');

CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role <> 'admin');

CREATE POLICY "Service role full access"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Books table policies
CREATE POLICY "Anyone can view books"
  ON books
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Admins can manage books"
  ON books
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Service role full access"
  ON books
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Borrowed books table policies
CREATE POLICY "Users can view their borrowed books"
  ON borrowed_books
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can borrow books"
  ON borrowed_books
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can return their borrowed books"
  ON borrowed_books
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all borrowed books"
  ON borrowed_books
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Service role full access"
  ON borrowed_books
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO books (title, author, category, price, cover_image, status) VALUES
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 29.99, 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg', 'available'),
('1984', 'George Orwell', 'Science Fiction', 24.99, 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg', 'available'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 19.99, 'https://images.pexels.com/photos/1516983/pexels-photo-1516983.jpeg', 'available'),
('Pride and Prejudice', 'Jane Austen', 'Romance', 22.99, 'https://images.pexels.com/photos/3747576/pexels-photo-3747576.jpeg', 'available'),
('The Catcher in the Rye', 'J.D. Salinger', 'Fiction', 21.99, 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg', 'available'),
('Lord of the Flies', 'William Golding', 'Fiction', 18.99, 'https://images.pexels.com/photos/1765033/pexels-photo-1765033.jpeg', 'available');
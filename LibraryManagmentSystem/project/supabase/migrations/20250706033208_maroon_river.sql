/*
  # Add missing columns and policies for library management

  1. New Columns
    - Add `pdf_file` and `price` columns to books table
    - Add `student_id`, `department`, and `verification_status` columns to users table

  2. Security Policies
    - Add admin book insertion policy (if not exists)
    - Add service role full access policies (if not exists)

  3. Safety
    - All operations use IF NOT EXISTS to prevent conflicts
    - Handles existing policies gracefully
*/

-- Add missing columns to books table
DO $$
BEGIN
  -- Add pdf_file column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'pdf_file'
  ) THEN
    ALTER TABLE books ADD COLUMN pdf_file text;
  END IF;

  -- Add price column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'books' AND column_name = 'price'
  ) THEN
    ALTER TABLE books ADD COLUMN price numeric DEFAULT 0;
  END IF;
END $$;

-- Add missing columns to users table
DO $$
BEGIN
  -- Add student_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'student_id'
  ) THEN
    ALTER TABLE users ADD COLUMN student_id text;
  END IF;

  -- Add department column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'department'
  ) THEN
    ALTER TABLE users ADD COLUMN department text;
  END IF;

  -- Add verification_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'verification_status'
  ) THEN
    ALTER TABLE users ADD COLUMN verification_status text DEFAULT 'pending';
  END IF;
END $$;

-- Add policies safely (drop if exists, then create)
DO $$
BEGIN
  -- Drop and recreate admin book insertion policy
  DROP POLICY IF EXISTS "Admins can insert books" ON books;
  CREATE POLICY "Admins can insert books"
    ON books
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    ));

  -- Drop and recreate service role policies for users
  DROP POLICY IF EXISTS "Service role full access" ON users;
  CREATE POLICY "Service role full access"
    ON users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

  -- Drop and recreate service role policies for books
  DROP POLICY IF EXISTS "Service role full access" ON books;
  CREATE POLICY "Service role full access"
    ON books
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

  -- Drop and recreate service role policies for borrowed_books
  DROP POLICY IF EXISTS "Service role full access" ON borrowed_books;
  CREATE POLICY "Service role full access"
    ON borrowed_books
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
END $$;
/*
  # Remove all users from the system

  1. Delete Operations
    - Remove all borrowed books records
    - Remove all user records (except admin)
    - Clear verification data

  2. Safety
    - Keeps admin user intact
    - Maintains data integrity with foreign key constraints
*/

-- Delete all borrowed books first (due to foreign key constraints)
DELETE FROM borrowed_books;

-- Delete all users except admin
DELETE FROM users WHERE role != 'admin';

-- Note: This will keep the admin user intact while removing all regular users
-- The admin can still access the system and manage books
/*
  # Update admin credentials

  Updates the admin user with proper credentials and ensures admin role is set correctly.
*/

DO $$ 
BEGIN
  -- Update admin user email and ensure admin role
  UPDATE users 
  SET 
    email = 'sofikulrohan171932@gmail.com',
    role = 'admin',
    name = 'Admin User'
  WHERE role = 'admin';

  -- If no admin exists, create one
  INSERT INTO users (id, email, name, role)
  SELECT 
    gen_random_uuid(),
    'sofikulrohan171932@gmail.com',
    'Admin User',
    'admin'
  WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE role = 'admin'
  );
END $$;
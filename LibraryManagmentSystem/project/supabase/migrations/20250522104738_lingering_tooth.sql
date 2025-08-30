/*
  # Create admin user

  Creates the initial admin user for the system with the specified email.
*/

DO $$ 
BEGIN
  -- Insert admin user if not exists
  INSERT INTO users (id, email, name, role)
  SELECT 
    auth.uid(),
    'admintrrs@rmu222.com',
    'Admin User',
    'admin'
  FROM auth.users
  WHERE email = 'admintrrs@rmu222.com'
  ON CONFLICT (email) DO UPDATE
  SET role = 'admin';
END $$;
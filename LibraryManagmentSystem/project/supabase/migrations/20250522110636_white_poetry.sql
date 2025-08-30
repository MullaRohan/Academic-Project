/*
  # Update admin email address

  Updates the email address for the admin user while maintaining all permissions and data.
*/

DO $$ 
BEGIN
  -- Update admin user email
  UPDATE users 
  SET email = 'sofikulrohan171932@gmail.com'
  WHERE email = 'admintrrs@rmu222.com' AND role = 'admin';
END $$;
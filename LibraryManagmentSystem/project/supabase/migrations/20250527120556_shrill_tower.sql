/*
  # Add user registration policy

  1. Security Changes
    - Add RLS policy to allow new users to insert their own data during registration
    - Policy ensures users can only insert a row with their own auth.uid()
    - Policy prevents users from setting role as 'admin'

  Note: This policy is specifically for the registration process and works in conjunction
  with existing policies for update and select operations.
*/

CREATE POLICY "Users can insert their own data during registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id AND
    role = 'user'
  );
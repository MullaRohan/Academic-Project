import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  studentId?: string;
  department?: string;
  verificationStatus?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  register: (email: string, password: string, name: string, studentId?: string, department?: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: Error | null }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials - in production, this should be in environment variables
const ADMIN_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          // Clear any stale tokens
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any stale tokens on error
        await supabase.auth.signOut();
        setLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      console.log('Fetching user profile for:', authUser.email);
      
      // Check if this is admin login
      if (authUser.email === ADMIN_CREDENTIALS.email) {
        console.log('Admin user detected');
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: 'Admin User',
          role: 'admin'
        });
        setLoading(false);
        return;
      }

      // For regular users, fetch from database using maybeSingle() to handle no rows gracefully
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile from Supabase:', error);
        
        // Fallback: Check localStorage for user data
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userRecord = registeredUsers.find((u: any) => u.email === authUser.email);
        
        if (userRecord) {
          console.log('Found user in localStorage:', userRecord);
          
          // Try to create user in Supabase
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email,
              name: userRecord.name,
              role: 'user',
              student_id: userRecord.studentId,
              department: userRecord.department,
              verification_status: userRecord.verificationStatus || 'pending'
            });

          if (insertError) {
            console.error('Error creating user in Supabase:', insertError);
          }
          
          // Check verification status from localStorage
          const verificationData = localStorage.getItem(`verification_${userRecord.id}`);
          let verificationStatus = userRecord.verificationStatus || 'pending';
          
          if (verificationData) {
            const data = JSON.parse(verificationData);
            verificationStatus = data.status || verificationStatus;
          }
          
          setUser({
            id: authUser.id,
            email: userRecord.email,
            name: userRecord.name,
            role: 'user',
            bio: userRecord.bio || undefined,
            studentId: userRecord.studentId || undefined,
            department: userRecord.department || undefined,
            verificationStatus: verificationStatus,
          });
        } else {
          console.log('User not found in localStorage either');
          setUser(null);
        }
      } else if (data) {
        console.log('User profile from Supabase:', data);
        
        // Check verification status from localStorage as well
        const verificationData = localStorage.getItem(`verification_${data.id}`);
        let verificationStatus = data.verification_status || 'pending';
        
        if (verificationData) {
          const verData = JSON.parse(verificationData);
          verificationStatus = verData.status || verificationStatus;
        }
        
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as UserRole,
          bio: data.bio || undefined,
          studentId: data.student_id || undefined,
          department: data.department || undefined,
          verificationStatus: verificationStatus,
        });
      } else {
        // data is null, meaning no user profile found in Supabase
        console.log('No user profile found in Supabase, checking localStorage');
        
        // Fallback: Check localStorage for user data
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userRecord = registeredUsers.find((u: any) => u.email === authUser.email);
        
        if (userRecord) {
          console.log('Found user in localStorage:', userRecord);
          
          // Try to create user in Supabase
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email,
              name: userRecord.name,
              role: 'user',
              student_id: userRecord.studentId,
              department: userRecord.department,
              verification_status: userRecord.verificationStatus || 'pending'
            });

          if (insertError) {
            console.error('Error creating user in Supabase:', insertError);
          }
          
          // Check verification status from localStorage
          const verificationData = localStorage.getItem(`verification_${userRecord.id}`);
          let verificationStatus = userRecord.verificationStatus || 'pending';
          
          if (verificationData) {
            const data = JSON.parse(verificationData);
            verificationStatus = data.status || verificationStatus;
          }
          
          setUser({
            id: authUser.id,
            email: userRecord.email,
            name: userRecord.name,
            role: 'user',
            bio: userRecord.bio || undefined,
            studentId: userRecord.studentId || undefined,
            department: userRecord.department || undefined,
            verificationStatus: verificationStatus,
          });
        } else {
          console.log('User not found in localStorage either');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);

      // Check for admin login first
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        console.log('Admin login attempt');
        
        // Create admin session in Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: ADMIN_CREDENTIALS.email,
          password: ADMIN_CREDENTIALS.password,
        });

        if (error) {
          console.log('Admin not found in Supabase, creating admin account');
          
          // If admin doesn't exist in Supabase, create admin account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: ADMIN_CREDENTIALS.email,
            password: ADMIN_CREDENTIALS.password,
          });

          if (signUpError) {
            console.error('Error creating admin account:', signUpError);
            throw signUpError;
          }

          if (signUpData.user) {
            console.log('Admin account created, creating profile');
            
            // Create admin profile in database
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: signUpData.user.id,
                email: ADMIN_CREDENTIALS.email,
                name: 'Admin User',
                role: 'admin'
              });

            if (profileError) {
              console.error('Error creating admin profile:', profileError);
            }

            setUser({
              id: signUpData.user.id,
              email: ADMIN_CREDENTIALS.email,
              name: 'Admin User',
              role: 'admin'
            });
          }
        } else if (data.user) {
          console.log('Admin login successful');
          setUser({
            id: data.user.id,
            email: ADMIN_CREDENTIALS.email,
            name: 'Admin User',
            role: 'admin'
          });
        }

        return { error: null };
      }

      // Regular user login
      console.log('Regular user login attempt');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User login successful, fetching profile');
        await fetchUserProfile(data.user);
      }

      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, studentId?: string, department?: string) => {
    try {
      setLoading(true);
      console.log('Attempting registration for:', email);
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User registered in auth, creating profile');
        
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name,
            role: 'user',
            student_id: studentId,
            department,
            verification_status: 'pending'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue with localStorage fallback
        }

        // Also save to localStorage for backward compatibility
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const newUser = {
          id: data.user.id,
          email,
          password,
          name,
          studentId,
          department,
          role: 'user' as const,
          registeredDate: new Date(),
          verificationStatus: 'pending'
        };
        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        await fetchUserProfile(data.user);
      }

      return { error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('Logging out user');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      setUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');

      console.log('Updating profile for user:', user.id, updates);

      // Don't update admin profile in database
      if (user.role === 'admin') {
        setUser({ ...user, ...updates });
        return { error: null };
      }

      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          bio: updates.bio,
          student_id: updates.studentId,
          department: updates.department,
          verification_status: updates.verificationStatus,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
      }

      // Update localStorage as well
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = registeredUsers.map((u: any) => 
        u.id === user.id ? { ...u, ...updates } : u
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      setUser({ ...user, ...updates });
      console.log('Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as Error };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      console.log('Changing password for user:', user?.email);
      
      // For admin, check against hardcoded password
      if (user?.role === 'admin') {
        if (currentPassword !== ADMIN_CREDENTIALS.password) {
          throw new Error('Current password is incorrect');
        }
        
        // Update admin password in Supabase
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;

        // Update the hardcoded password (in production, this would be in environment variables)
        ADMIN_CREDENTIALS.password = newPassword;
        
        console.log('Admin password changed successfully');
        return { error: null };
      }

      // For regular users, verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (verifyError) throw new Error('Current password is incorrect');

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      console.log('User password changed successfully');
      return { error: null };
    } catch (error) {
      console.error('Change password error:', error);
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          bio: string | null
          created_at: string | null
          student_id: string | null
          department: string | null
          verification_status: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: string
          bio?: string | null
          created_at?: string | null
          student_id?: string | null
          department?: string | null
          verification_status?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          bio?: string | null
          created_at?: string | null
          student_id?: string | null
          department?: string | null
          verification_status?: string | null
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          category: string
          cover_image: string | null
          status: string
          created_at: string | null
          pdf_file: string | null
          price: number | null
        }
        Insert: {
          id?: string
          title: string
          author: string
          category: string
          cover_image?: string | null
          status?: string
          created_at?: string | null
          pdf_file?: string | null
          price?: number | null
        }
        Update: {
          id?: string
          title?: string
          author?: string
          category?: string
          cover_image?: string | null
          status?: string
          created_at?: string | null
          pdf_file?: string | null
          price?: number | null
        }
      }
      borrowed_books: {
        Row: {
          id: string
          book_id: string | null
          user_id: string | null
          borrow_date: string
          due_date: string
          return_date: string | null
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          book_id?: string | null
          user_id?: string | null
          borrow_date?: string
          due_date: string
          return_date?: string | null
          status?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          book_id?: string | null
          user_id?: string | null
          borrow_date?: string
          due_date?: string
          return_date?: string | null
          status?: string
          created_at?: string | null
        }
      }
    }
  }
}
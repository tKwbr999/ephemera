import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if credentials are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase credentials. Please connect to Supabase from the StackBlitz interface.');
    
    // Return a mock client that won't throw errors but won't actually connect to Supabase
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase is not configured' } }),
        signInWithOAuth: () => Promise.resolve({ error: { message: 'Supabase is not configured' } }),
        signUp: () => Promise.resolve({ error: { message: 'Supabase is not configured' } }),
        signOut: () => Promise.resolve({ error: null })
      }
    } as any;
  }
  
  // Create a real Supabase client if credentials are available
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

// Add a helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
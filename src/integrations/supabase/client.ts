import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gmuuysgkwdzerdaqbayu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdXV5c2drd2R6ZXJkYXFiYXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1Njk1NjksImV4cCI6MjA1MTE0NTU2OX0.j4HXIdI2gdjmWU7qzgjbZuCht0cESnNiF_IZahTPVng";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  }
);
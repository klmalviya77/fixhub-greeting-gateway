
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://auzzqdsxjmxqgvtskonb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1enpxZHN4am14cWd2dHNrb25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNjE4NjIsImV4cCI6MjA1NzgzNzg2Mn0.ytl_GyrScbYuyzEgLLtdSYGQNmV8tBO6oNMJMBvClcM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

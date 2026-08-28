import { createClient } from '@supabase/supabase-js';
// Use safe placeholders so a missing deployment variable does not crash Next.js
// while it is collecting route data. Actual database calls still require config.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unconfigured.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'unconfigured-anon-key';
export const supabase = createClient(url, key);

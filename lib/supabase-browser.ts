'use client';
import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unconfigured.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'unconfigured-anon-key';
export const supabaseBrowser = createClient(url, key);

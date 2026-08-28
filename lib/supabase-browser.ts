'use client';
import { createClient } from '@supabase/supabase-js';
function safeUrl(value?: string) { try { const parsed = new URL(value || ''); return /^https?:$/.test(parsed.protocol) ? parsed.origin : 'https://unconfigured.supabase.co'; } catch { return 'https://unconfigured.supabase.co'; } }
const url = safeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'unconfigured-anon-key';
export const supabaseBrowser = createClient(url, key);

import { createClient } from '@supabase/supabase-js';
// Use safe placeholders so a missing deployment variable does not crash Next.js
// while it is collecting route data. Actual database calls still require config.
function safeUrl(value?: string) { try { const parsed = new URL(value || ''); return /^https?:$/.test(parsed.protocol) ? parsed.origin : 'https://unconfigured.supabase.co'; } catch { return 'https://unconfigured.supabase.co'; } }
const url = safeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'unconfigured-anon-key';
export const supabase = createClient(url, key);

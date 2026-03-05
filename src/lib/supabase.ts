import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Public Supabase client — uses anon key, respects RLS
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin Supabase client — uses service role key, bypasses RLS
 * Only use on the server side for admin operations like file uploads
 */
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
    : supabase; // Fallback to public client if no service key

/**
 * Storage bucket name for uploads
 */
export const STORAGE_BUCKET = "uploads";

/**
 * Get the public URL for a file in Supabase Storage
 */
export function getPublicUrl(path: string): string {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

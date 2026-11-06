import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration for The Book Exchange
 *
 * Vite requires client-side environment variables to be prefixed with `VITE_`.
 * This client reads:
 *   - VITE_SUPABASE_URL: Your project URL (e.g. https://xyzcompany.supabase.co)
 *   - VITE_SUPABASE_ANON_KEY or VITE_SUPABASE_PUBLISHABLE_KEY: The public anon/publishable API key
 *
 * NOTE: Never place Supabase service_role keys or database passwords in client files.
 */

// Safely access env vars in Vite client, Node/SSR, or testing environments
const getEnvVar = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process && process.env) {
    return process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('your-anon-key') &&
    !supabaseAnonKey.includes('placeholder')
);

export function getSupabaseConfigStatus(): {
  configured: boolean;
  hasUrl: boolean;
  hasKey: boolean;
  urlPreview?: string;
} {
  return {
    configured: isSupabaseConfigured,
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabaseAnonKey),
    urlPreview: supabaseUrl ? supabaseUrl.slice(0, 24) + '...' : undefined
  };
}

// Fallback dummy client creation prevents runtime crashes when env variables are not yet populated
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-anon-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );

export default supabase;

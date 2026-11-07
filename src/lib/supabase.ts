import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration for The Book Exchange
 *
 * Compatible with Vite, Cloudflare Pages, and Node/SSR runtimes.
 *
 * Vite requires client-side environment variables to be prefixed with `VITE_`.
 * During production builds (`vite build`), Vite's compiler performs static AST analysis
 * and replaces direct property accesses like:
 *   - import.meta.env.VITE_SUPABASE_URL
 *   - import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
 *
 * IMPORTANT FOR CLOUDFLARE PAGES & VITE BUILDS:
 * Computed member access like `import.meta.env[key]` cannot be statically inlined by Vite
 * and will evaluate to undefined in production bundles. Therefore, direct property access is used.
 *
 * Required environment variables:
 *   1. VITE_SUPABASE_URL
 *   2. VITE_SUPABASE_PUBLISHABLE_KEY (with backward-compatible fallback to VITE_SUPABASE_ANON_KEY)
 *
 * NOTE: Never expose Supabase `service_role` secret keys or database connection strings in client code.
 */

// Safe resolver that works in both Vite client bundles and Node.js / SSR / testing environments
const resolveClientEnv = (viteVal: string | undefined, nodeKey: string): string => {
  if (typeof viteVal === 'string' && viteVal.trim().length > 0) {
    return viteVal.trim();
  }
  if (typeof process !== 'undefined' && process?.env?.[nodeKey]) {
    const nodeVal = process.env[nodeKey];
    if (typeof nodeVal === 'string' && nodeVal.trim().length > 0) {
      return nodeVal.trim();
    }
  }
  return '';
};

// Direct static member accesses for Vite compiler replacement & Cloudflare Pages production builds
const metaEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;

export const supabaseUrl = resolveClientEnv(
  metaEnv?.VITE_SUPABASE_URL,
  'VITE_SUPABASE_URL'
);

// Primary variable: VITE_SUPABASE_PUBLISHABLE_KEY (with fallback to VITE_SUPABASE_ANON_KEY for backward compatibility)
export const supabasePublishableKey =
  resolveClientEnv(
    metaEnv?.VITE_SUPABASE_PUBLISHABLE_KEY,
    'VITE_SUPABASE_PUBLISHABLE_KEY'
  ) ||
  resolveClientEnv(
    metaEnv?.VITE_SUPABASE_ANON_KEY,
    'VITE_SUPABASE_ANON_KEY'
  );

// Helper to detect placeholder strings
const isPlaceholder = (val: string): boolean => {
  const lower = val.toLowerCase();
  return (
    lower.includes('your-project') ||
    lower.includes('placeholder') ||
    lower.includes('your-publishable') ||
    lower.includes('your-anon') ||
    lower.includes('example.com')
  );
};

/**
 * Returns a human-friendly error string if Supabase configuration is missing or invalid.
 * Returns null if the configuration is valid and ready to use.
 */
export const getSupabaseConfigError = (): string | null => {
  if (!supabaseUrl && !supabasePublishableKey) {
    return 'Supabase configuration is missing. Please define VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment variables to enable Google authentication.';
  }
  if (!supabaseUrl) {
    return 'Missing VITE_SUPABASE_URL. Please set your Supabase project URL in your environment settings (e.g., https://your-project.supabase.co).';
  }
  if (!supabasePublishableKey) {
    return 'Missing VITE_SUPABASE_PUBLISHABLE_KEY. Please set your Supabase publishable key in your environment settings.';
  }
  if (!supabaseUrl.startsWith('https://')) {
    return 'Invalid VITE_SUPABASE_URL: URL must start with https:// (e.g., https://your-project.supabase.co).';
  }
  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabasePublishableKey)) {
    return 'Supabase credentials contain placeholder values. Please update VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY with your real credentials from the Supabase dashboard.';
  }
  return null;
};

export const isSupabaseConfigured: boolean = getSupabaseConfigError() === null;

export function getSupabaseProjectRef(): string | null {
  if (!supabaseUrl) return null;
  try {
    const parsed = new URL(supabaseUrl);
    const host = parsed.hostname;
    if (host.endsWith('.supabase.co')) {
      return host.replace('.supabase.co', '');
    }
    return host;
  } catch {
    return null;
  }
}

export function getSupabaseConfigStatus(): {
  configured: boolean;
  hasUrl: boolean;
  hasKey: boolean;
  error: string | null;
  projectRef: string | null;
  urlPreview?: string;
} {
  return {
    configured: isSupabaseConfigured,
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabasePublishableKey),
    error: getSupabaseConfigError(),
    projectRef: getSupabaseProjectRef(),
    urlPreview: supabaseUrl ? (supabaseUrl.length > 28 ? supabaseUrl.slice(0, 28) + '...' : supabaseUrl) : undefined
  };
}

// Client initialization
// A safe fallback client is provided when not configured so that imports and initial renders do not crash
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabasePublishableKey || 'placeholder-publishable-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
// WebAuthn / Passkey capability detection
export function isWebAuthnSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential === 'function' &&
    typeof navigator !== 'undefined' &&
    navigator.credentials &&
    typeof navigator.credentials.create === 'function' &&
    typeof navigator.credentials.get === 'function'
  );
}

// User-friendly WebAuthn error formatting
export function formatPasskeyError(err: any): string {
  if (!err) return 'Passkey operation could not be completed.';
  const msg = typeof err === 'string' ? err : (err.message || String(err));
  const lower = msg.toLowerCase();

  if (lower.includes('notallowederror') || lower.includes('canceled') || lower.includes('cancelled') || lower.includes('not allowed')) {
    return 'Passkey authentication was cancelled.';
  }
  if (lower.includes('relying party id') || lower.includes('securityerror') || lower.includes('rp id')) {
    return 'The passkey is configured for the production domain (the-book-exchange.pages.dev). WebAuthn browser security prevents using this Relying Party ID on other origins.';
  }
  if (lower.includes('does not support webauthn') || lower.includes('notsupportederror')) {
    return 'This device or browser does not support passkeys.';
  }
  if (lower.includes('challenge expired') || lower.includes('expired')) {
    return 'The passkey authentication challenge has expired. Please try again.';
  }
  if (lower.includes('no credential') || lower.includes('not found') || lower.includes('no matching passkey')) {
    return 'No registered passkey found on this device. Please register a passkey from your Account Security settings first.';
  }
  return msg;
}

export default supabase;

import { createBrowserClient } from '@supabase/ssr';

/**
 * Klient Supabase do użycia w komponentach klienckich ('use client').
 * Tworzy singleton w przeglądarce.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Klient Supabase do użycia w Server Components, Server Actions
 * i Route Handlers. Sesja użytkownika jest odczytywana z cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Wywołane z Server Component - cookies są tylko do odczytu.
            // Middleware odświeży sesję, więc można to zignorować.
          }
        },
      },
    }
  );
}

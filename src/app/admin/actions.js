'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function deleteResponse(formData) {
  const id = formData.get('id');
  if (!id) return;
  const supabase = await createClient();
  await supabase.from('date_responses').delete().eq('id', id);
  revalidatePath('/admin');
}

export async function clearAll() {
  const supabase = await createClient();
  // Filtr "not null" na kluczu głównym = wszystkie wiersze (PostgREST wymaga filtra przy delete).
  await supabase.from('date_responses').delete().not('id', 'is', null);
  revalidatePath('/admin');
}

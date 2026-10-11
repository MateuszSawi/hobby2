'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function clearAll() {
  const supabase = await createClient();
  await supabase.from('date_responses').delete().not('id', 'is', null);
  revalidatePath('/admin');
}

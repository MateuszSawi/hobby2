import { createClient } from '@/lib/supabase/server';
import { clearAll } from './actions';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

const LABELS = {
  thursday: 'Czwartek',
  friday: 'Piątek',
  saturday: 'Sobota',
  boring_serious: 'Nudno i poważnie',
  fun_romantic: 'Zabawnie i romantycznie',
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('date_responses')
    .select('day, time, vibe, place')
    .limit(1)
    .maybeSingle();

  const choices = data
    ? [LABELS[data.day] || data.day, data.time, LABELS[data.vibe] || data.vibe, data.place]
    : [];

  return (
    <main style={{ padding: '2rem 1rem' }}>
      {choices.map(
        (value, i) => value && <p key={i}>{value}</p>
      )}
      <form action={clearAll} style={{ marginTop: '2rem' }}>
        <button type="submit">Wyczyść</button>
      </form>
    </main>
  );
}

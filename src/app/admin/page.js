import { createClient } from '@/lib/supabase/server';
import { clearAll } from './actions';
import styles from './page.module.scss';

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
    <main className={styles.main}>
      {choices.map(
        (value, i) =>
          value && (
            <p key={i} className={styles.choice}>
              {value}
            </p>
          )
      )}
      <form action={clearAll}>
        <button type="submit" className={styles.clear}>
          Wyczyść
        </button>
      </form>
    </main>
  );
}

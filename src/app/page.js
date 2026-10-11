import { createClient } from '@/lib/supabase/server';
import DateInvite from '@/components/DateInvite/DateInvite';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('date_responses')
    .select('day, time, vibe, place, completed')
    .eq('completed', true)
    .limit(1)
    .maybeSingle();

  return (
    <main className={styles.main}>
      <DateInvite initial={data} />
    </main>
  );
}

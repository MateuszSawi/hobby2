import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { clearAll, deleteResponse } from './actions';
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

function label(value) {
  return value ? LABELS[value] || value : '—';
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('pl-PL', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from('date_responses')
    .select('*')
    .order('updated_at', { ascending: false });

  const current = rows?.[0];

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin</h1>
          <p className={styles.muted}>
            <Link href="/">otwórz zaproszenie</Link>
          </p>
        </div>
        {rows?.length > 0 && (
          <form action={clearAll}>
            <button type="submit" className={styles.danger}>
              Wyczyść wszystko
            </button>
          </form>
        )}
      </header>

      {error && (
        <p className={styles.error}>
          {error.message}
          {error.code === 'PGRST205' &&
            ' — uruchom supabase/migrations/0001_date_responses.sql w SQL Editorze.'}
        </p>
      )}

      {!error && !current && (
        <p className={styles.muted}>Jeszcze nic nie wybrała.</p>
      )}

      {current && (
        <section className={styles.summary} aria-labelledby="summary-title">
          <h2 id="summary-title" className={styles.summaryTitle}>
            Jej wybory{' '}
            <span
              className={`${styles.badge} ${current.completed ? styles.badgeDone : ''}`}
            >
              {current.completed ? 'ukończone' : 'w trakcie'}
            </span>
          </h2>
          <dl>
            <div className={styles.summaryRow}>
              <dt>Dzień</dt>
              <dd>{label(current.day)}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Godzina</dt>
              <dd>{current.time || '—'}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Vibe</dt>
              <dd>{label(current.vibe)}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Miejsce</dt>
              <dd>{current.place || '—'}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Zaczęła</dt>
              <dd>{formatDate(current.created_at)}</dd>
            </div>
            <div className={styles.summaryRow}>
              <dt>Ostatnia zmiana</dt>
              <dd>{formatDate(current.updated_at)}</dd>
            </div>
          </dl>
        </section>
      )}

      {rows?.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ostatnia zmiana</th>
                <th>Dzień</th>
                <th>Godzina</th>
                <th>Vibe</th>
                <th>Miejsce</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={styles.nowrap}>{formatDate(r.updated_at)}</td>
                  <td>{label(r.day)}</td>
                  <td>{r.time || '—'}</td>
                  <td>{label(r.vibe)}</td>
                  <td className={styles.place}>{r.place ? 'Wybrane' : '—'}</td>
                  <td>{r.completed ? 'Ukończone' : 'W trakcie'}</td>
                  <td>
                    <form action={deleteResponse}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className={styles.linkButton}>
                        usuń
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

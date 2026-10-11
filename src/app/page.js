import DateInvite from '@/components/DateInvite/DateInvite';
import styles from './page.module.scss';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <DateInvite />
    </main>
  );
}

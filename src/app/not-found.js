import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <h1>Nothing here.</h1>
      <Link href="/">Go back</Link>
    </main>
  );
}

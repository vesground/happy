import Head from 'next/head';
import Link from 'next/link';

import styles from 'styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Emotional</title>
        <meta name="description" content="Learn your emotions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.header}>
        <Link href="/">
          <span style={{ marginRight: '8px' }}>home</span>
        </Link>
        <Link href="/dashboard">dashboard</Link>
      </div>

      <main className={styles.main}>{children}</main>

      <p className={styles.desktop}>Sorry, but we don&apos;t support desktop version right now. Keep following us!</p>
    </div>
  );
}

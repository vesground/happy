import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Emotional</title>
        <meta name="description" content="Learn your emotions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/">
        <span style={{ marginRight: '8px' }}>home</span>
      </Link>
      <Link href="/dashboard">dashboard</Link>

      <main className={styles.main}>{children}</main>
    </div>
  );
}

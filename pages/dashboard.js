import Head from 'next/head';
import useSWR from 'swr';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Dashboard() {
  const { data, error } = useSWR(() => `http://localhost:3000/api/records?userId=1`, fetcher);
  if (!data) return 'loading...';

  return (
    <div className={styles.container}>
      <Head>
        <title>Emotional</title>
        <meta name="description" content="Learn your emotions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/"><span style={{marginRight: '8px'}}>home</span></Link>
      <Link href="/dashboard">dashboard</Link>

      <main className={styles.main}>
        {data?.map(({ id, emotion }) => (
          <p key={id}>{emotion.name}</p>
        ))}
      </main>
    </div>
  );
}

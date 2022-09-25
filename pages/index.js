import Head from 'next/head';
import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  const [primaryEmotion, setPrimaryEmotion] = useState(null);
  const [query, setQuery] = useState('type=primary');

  const { data, error } = useSWR(() => `http://localhost:3000/api/emotions?${query}`, fetcher);

  const handleClick = (type, emotionId) => async () => {
    if (!primaryEmotion) {
      setPrimaryEmotion(emotionId);
      setQuery(`type=secondary&primaryEmotionId=${emotionId}`);
    } else {
      const data = {
        userId: 1,
        emotionId,
      };
      await fetch(`http://localhost:3000/api/records`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setPrimaryEmotion(null);
      setQuery(`type=primary`);
    }
  };

  if (!data) return 'loading...';

  return (
    <div className={styles.container}>
      <Head>
        <title>Emotional</title>
        <meta name="description" content="Learn your emotions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/">home</Link>
      <Link href="/dashboard">dashboard</Link>

      <main className={styles.main}>
        {data?.map((emotion) => (
          <button onClick={handleClick(emotion.type, emotion.id)} className={styles.emotion} key={emotion.id}>
            {emotion.name}
          </button>
        ))}
      </main>
    </div>
  );
}

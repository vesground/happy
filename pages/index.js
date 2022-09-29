import Head from 'next/head';
import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

import styles from '../styles/Home.module.css';
import Layout from 'components/Layout';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  const [primaryEmotion, setPrimaryEmotion] = useState(null);
  const [query, setQuery] = useState('type=primary');

  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/emotions?${query}`, fetcher);

  const handleClick = (type, emotionId) => async () => {
    if (!primaryEmotion) {
      setPrimaryEmotion(emotionId);
      setQuery(`type=secondary&primaryEmotionId=${emotionId}`);
    } else {
      const data = {
        userId: 1,
        emotionId,
      };
      await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setPrimaryEmotion(null);
      setQuery(`type=primary`);
    }
  };

  if (!data) return 'loading...';

  return (
    <Layout>
      {data?.map((emotion) => (
        <button onClick={handleClick(emotion.type, emotion.id)} className={styles.emotion} key={emotion.id}>
          {emotion.name}
        </button>
      ))}
    </Layout>
  );
}

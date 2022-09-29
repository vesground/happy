import { useState } from 'react';
import useSWR from 'swr';

import styles from 'styles/Home.module.scss';
import Layout from 'components/Layout';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('type=primary');

  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/emotions?${query}`, fetcher);

  const handleClick = (type, emotionId) => async () => {
    if (type === 'primary') {
      setSelected({ primary: emotionId });
      setQuery(`type=secondary&primaryEmotionId=${emotionId}`);
    } else if (type === 'secondary') {
      setSelected((state) => ({ ...state, secondary: emotionId }));
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const reason = event.target[0].value;

    const data = {
      userId: 1,
      emotionId: selected.secondary,
      reason,
    };

    fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setSelected(null);
    setQuery(`type=primary`);
  }

  return (
    <Layout loading={!data} alignY>
      {data?.map((emotion) => {
        return (
          <div className={styles.emotion} key={emotion.id}>
            <button onClick={handleClick(emotion.type, emotion.id)}>{emotion.name}</button>

            {selected?.secondary === emotion.id && (
              <form className={styles.form} onSubmit={handleSubmit}>
                <input type="text" name="reason" />
                <button type="submit">submit</button>
              </form>
            )}
          </div>
        );
      })}
    </Layout>
  );
}

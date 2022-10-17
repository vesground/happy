import { useState } from 'react';
import useSWR from 'swr';

import styles from 'styles/Home.module.scss';
import Layout from 'components/Layout';
import withAuthentication from 'components/withAuthentication';
import { fetcher } from 'utils';
import ModalEditEmotion from 'components/ModalEditEmotion';

function Home() {
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

  function reset() {
    setSelected(null);
    setQuery(`type=primary`);
  }

  return (
    <Layout loading={!data} alignY>
      {data?.map((emotion) => {
        return (
          <div className={styles.emotion} key={emotion.id}>
            <button onClick={handleClick(emotion.type, emotion.id)}>{emotion.name}</button>
          </div>
        );
      })}

      <ModalEditEmotion isOpen={!!selected?.secondary} handleClose={reset} emotionId={selected?.secondary} />
    </Layout>
  );
}

export default withAuthentication(Home);

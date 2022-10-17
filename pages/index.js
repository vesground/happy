import { useState } from 'react';
import useSWR from 'swr';

import Layout from 'components/Layout';
import withAuthentication from 'components/withAuthentication';
import { fetcher } from 'utils';
import ModalEditEmotion from 'components/ModalEditEmotion';

import styles from 'styles/Home.module.scss';

function Home() {
  const [selected, setSelected] = useState(null);

  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/emotions`, fetcher);

  const handleClick = (type, emotionId) => async () => {
    if (type === 'primary') {
      setSelected({ primary: emotionId });
    } else if (type === 'secondary') {
      setSelected((state) => ({ ...state, secondary: emotionId }));
    }
  };

  function reset() {
    setSelected(null);
  }

  async function createRecord(reason) {
    const data = {
      userId: 1,
      emotionId: selected.secondary,
      reason,
    };

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    reset();
  }

  const filter = selected?.primary ? filterSecondaryEmotions(selected.primary) : filterPrimaryEmotions;
  const emotions = data?.filter(filter) || [];

  return (
    <Layout loading={!data} alignY>
      {emotions.map((emotion) => (
        <button className={styles.emotion} key={emotion.id} onClick={handleClick(emotion.type, emotion.id)}>
          {emotion.name}
        </button>
      ))}

      <ModalEditEmotion isOpen={!!selected?.secondary} handleClose={reset} onSubmit={createRecord} />
    </Layout>
  );
}

const filterPrimaryEmotions = (emotion) => emotion.type === 'primary';
const filterSecondaryEmotions = (primaryEmotionId) => (emotion) =>
  emotion.type === 'secondary' && primaryEmotionId === emotion.primaryEmotionId;

export default withAuthentication(Home);

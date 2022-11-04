import { useState } from 'react';
import useSWR from 'swr';

import Layout from 'components/Layout';
import withAuthentication from 'components/withAuthentication';
import { fetcher } from 'utils';
import ModalEditEmotion from 'components/ModalEditEmotion';
import Button, { Secondary } from 'components/Button';

import styles from 'styles/Home.module.scss';

function Home() {
  const [selected, setSelected] = useState(null);

  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/emotions`, fetcher);

  const handleClick = (type, emotionId) => async () => {
    if (type === 'primary') {
      setSelected({ primary: emotionId });
    } else if (type === 'secondary') {
      setSelected((state) => ({ ...state, secondary: emotionId }));
    } else if (type === 'tertiary') {
      setSelected((state) => ({ ...state, tertiary: emotionId }));
    }
  };

  function reset() {
    setSelected(null);
  }

  async function createRecord(reason) {
    const data = {
      userId: 1,
      emotionId: selected.tertiary ?? selected.secondary,
      reason,
    };

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    reset();
  }

  let filter = filterPrimaryEmotions;
  if (selected?.secondary) {
    filter = filterTertiaryEmotions(selected.secondary);
  } else if (selected?.primary) {
    filter = filterSecondaryEmotions(selected.primary);
  }
  const emotions = data?.filter(filter) || [];

  const hasTertiaryEmotions = !!selected?.secondary && emotions.length > 0;
  const isModalOpen = !!(hasTertiaryEmotions ? selected?.tertiary : selected?.secondary);

  return (
    <Layout loading={!data} alignY>
      {emotions.map((emotion) => (
        <Button
          type="secondary"
          className={styles.emotion}
          key={emotion.id}
          onClick={handleClick(emotion.type, emotion.id)}
        >
          {emotion.name}
        </Button>
      ))}

      <ModalEditEmotion isOpen={isModalOpen} handleClose={reset} onSubmit={createRecord} />
    </Layout>
  );
}

const filterPrimaryEmotions = (emotion) => emotion.type === 'primary';
const filterSecondaryEmotions = (primaryEmotionId) => (emotion) =>
  emotion.type === 'secondary' && primaryEmotionId === emotion.primaryEmotionId;
const filterTertiaryEmotions = (secondaryEmotionId) => (emotion) =>
  emotion.type === 'tertiary' && secondaryEmotionId === emotion.primaryEmotionId;

export default withAuthentication(Home);

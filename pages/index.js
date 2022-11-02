import { useEffect, useState } from 'react';
import useSWR from 'swr';

import Layout from 'components/Layout';
import withAuthentication from 'components/withAuthentication';
import { fetcher } from 'utils';
import ModalEditEmotion from 'components/ModalEditEmotion';

import styles from 'styles/Home.module.scss';

const EMOTIONS_API_URL = `${process.env.NEXT_PUBLIC_HOST}/api/emotions`;

// readChunks() reads from the provided reader and yields the results into an async iterable
function readChunks(reader) {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read();
      while (!readResult.done) {
        yield readResult.value;
        readResult = await reader.read();
      }
    },
  };
}

function Home() {
  const [selected, setSelected] = useState(null);
  const [fetched, setFetched] = useState([]);

  console.log('render');

  useEffect(() => {
    console.log('use effect fucking useeffect');
    (async () => {
      let emotions = [];
      const response = await fetch(`${EMOTIONS_API_URL}/stream`);
      const reader = response.body.getReader();
      for await (const chunk of readChunks(reader)) {
        const stringified = new TextDecoder().decode(chunk);
        const emotionsChunk = JSON.parse(stringified);
        emotions = emotions.concat(emotionsChunk);
      }
      setFetched(emotions);
    })();
  }, []);

  const { data, error } = useSWR(() => `${EMOTIONS_API_URL}?type=primary`, fetcher);

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
  const emotions = (fetched.length ? fetched : data)?.filter(filter) || [];

  const hasTertiaryEmotions = !!selected?.secondary && emotions.length > 0;
  const isModalOpen = !!(hasTertiaryEmotions ? selected?.tertiary : selected?.secondary);

  return (
    <Layout loading={!data} alignY>
      {emotions.map((emotion) => (
        <button className={styles.emotion} key={emotion.id} onClick={handleClick(emotion.type, emotion.id)}>
          {emotion.name}
        </button>
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

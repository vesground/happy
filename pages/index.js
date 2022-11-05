import { useState } from 'react';
import useSWR from 'swr';
import { BiPlus, BiMinus } from 'react-icons/bi';

import Layout from 'components/Layout';
import withAuthentication from 'components/withAuthentication';
import { fetcher } from 'utils';
import ModalEditEmotion from 'components/ModalEditEmotion';
import Button from 'components/Button';

import styles from 'styles/Home.module.scss';

function Home() {
  const [opened, setOpened] = useState([]);
  const [selected, setSelected] = useState([]);

  const [openedModal, setOpenedModal] = useState(false);

  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/emotions`, fetcher);

  const handleOpen = (type, emotionId) => () => {
    setOpened((opened) => [...opened, emotionId]);
  };

  const handleSelect = (emotionId) => () => {
    const isSelected = selected.includes(emotionId);
    setSelected((selected) => (isSelected ? selected.filter((id) => id !== emotionId) : [...selected, emotionId]));
  };

  function handleClose() {
    setOpened((opened) => (opened.length ? opened.slice(0, opened.length - 1) : opened));
  }

  function reset() {
    setOpened([]);
  }

  async function createRecord(reason) {
    const data = {
      userId: 3,
      emotions: selected,
      reason,
    };

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    setOpenedModal(false);
    reset();
  }

  let filter = filterPrimaryEmotions;
  if (opened.length === 2) {
    filter = filterTertiaryEmotions(opened[1]);
  } else if (opened.length === 1) {
    filter = filterSecondaryEmotions(opened[0]);
  }

  const emotions = data?.filter(filter) || [];

  function openModal() {
    setOpenedModal(true);
  }

  function closeModal() {
    setOpenedModal(false);
  }

  return (
    <Layout loading={!data} alignY>
      {emotions.map((emotion) => (
        <div className={styles.emotion} key={emotion.id}>
          <Button
            type="secondary"
            className={styles.emotionBtn}
            key={emotion.id}
            onClick={handleOpen(emotion.type, emotion.id)}
          >
            {emotion.name}
          </Button>
          <Button type="icon" onClick={handleSelect(emotion.id)}>
            {selected.includes(emotion.id) ? <BiMinus /> : <BiPlus />}
          </Button>
        </div>
      ))}

      <div>
        {!!opened.length && (
          <Button className={styles.backBtn} onClick={handleClose}>
            back
          </Button>
        )}
        {!!selected.length && (
          <Button className={styles.submitBtn} onClick={openModal}>
            submit
          </Button>
        )}
      </div>

      <ModalEditEmotion isOpen={openedModal} handleClose={closeModal} onSubmit={createRecord} />
    </Layout>
  );
}

const filterPrimaryEmotions = (emotion) => emotion.type === 'primary';
const filterSecondaryEmotions = (primaryEmotionId) => (emotion) =>
  emotion.type === 'secondary' && primaryEmotionId === emotion.primaryEmotionId;
const filterTertiaryEmotions = (secondaryEmotionId) => (emotion) =>
  emotion.type === 'tertiary' && secondaryEmotionId === emotion.primaryEmotionId;

export default withAuthentication(Home);

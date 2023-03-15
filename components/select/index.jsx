import { useState, useImperativeHandle, forwardRef } from 'react';
import useSWR from 'swr';
import { BiPlus, BiMinus } from 'react-icons/bi';

import { fetcher } from 'utils';
import Button from 'components/select/Button';

import styles from 'styles/select/index.module.scss';

function EmotionsSelect({ selected, onChange, onSubmit }, ref) {
  const [opened, setOpened] = useState([]);

  useImperativeHandle(ref, () => ({
    close: () => {
      setOpened([]);
    },
  }));

  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/emotions`, fetcher);

  const handleOpen = (type, emotionId) => () => {
    setOpened((opened) => [...opened, emotionId]);
  };

  function handleClose() {
    setOpened((opened) => (opened.length ? opened.slice(0, opened.length - 1) : opened));
  }

  let filter = filterPrimaryEmotions;
  if (opened.length === 2) {
    filter = filterTertiaryEmotions(opened[1]);
  } else if (opened.length === 1) {
    filter = filterSecondaryEmotions(opened[0]);
  }

  const emotions = data?.filter(filter) || [];

  return (
    <div>
      {!!opened.length && (
        <Button className={styles.backBtn} onClick={handleClose}>
          back
        </Button>
      )}
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
          <Button type="icon" onClick={onChange(emotion.id)}>
            {selected.includes(emotion.id) ? <BiMinus /> : <BiPlus />}
          </Button>
        </div>
      ))}
      {!!selected.length && onSubmit && (
        <Button className={styles.submitBtn} onClick={onSubmit}>
          submit
        </Button>
      )}
    </div>
  );
}

const filterPrimaryEmotions = (emotion) => emotion.type === 'primary';
const filterSecondaryEmotions = (primaryEmotionId) => (emotion) =>
  emotion.type === 'secondary' && primaryEmotionId === emotion.primaryEmotionId;
const filterTertiaryEmotions = (secondaryEmotionId) => (emotion) =>
  emotion.type === 'tertiary' && secondaryEmotionId === emotion.primaryEmotionId;

export default forwardRef(EmotionsSelect);

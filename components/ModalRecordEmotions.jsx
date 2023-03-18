import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import cn from 'classnames';
import useSWR from 'swr';

import EmotionsSelect from 'components/select';
import Button from 'components/Button';

import { fetcher } from 'utils';
import styles from 'styles/Modal.module.scss';

export default function ModalRecordEmotions({ isOpen, handleClose, onSubmit, record, loading }) {
  const [selected, setSelected] = useState([]);

  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/emotions`, fetcher);

  useEffect(() => {
    if (record?.emotions) {
      setSelected(record.emotions);
    }
  }, [record?.emotions?.length]);

  const handleSelect = (emotionId) => () => {
    const isSelected = selected.includes(emotionId);
    setSelected((selected) => (isSelected ? selected.filter((id) => id !== emotionId) : [...selected, emotionId]));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    onSubmit({ emotions: selected });
  }

  return (
    <ReactModal isOpen={isOpen} contentLabel="Edit emotion">
      {data?.length ? renderSelectedEmotions(selected, data) : <p>...</p>}
      <EmotionsSelect selected={selected} onChange={handleSelect} />
      <div className={cn(styles.buttonGroup, styles.buttonGroupBottomRight)}>
        <Button type="button" onClick={handleClose} disabled={loading}>
          close
        </Button>
        <Button type="submit" loading={loading} onClick={handleSubmit}>save</Button>
      </div>
    </ReactModal>
  );
}

function renderSelectedEmotions(ids, emotions) {
  const emotionsTitles = ids.map(id => emotions.find(emotion => emotion.id === id).name);
  return (
      <p>Selected emotions: {emotionsTitles.join(', ')}</p>
  );
}
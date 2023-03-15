import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import EmotionsSelect from 'components/select';

import styles from 'styles/ModalRecordReason.module.scss';
import Button from 'components/Button';

export default function ModalRecordEmotions({ isOpen, handleClose, onSubmit, record, loading }) {
  const [selected, setSelected] = useState([]);

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
      <EmotionsSelect selected={selected} onChange={handleSelect} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.buttonGroup}>
          <Button type="button" onClick={handleClose} disabled={loading}>
            close
          </Button>
          <Button type="submit" loading={loading}>save</Button>
        </div>
      </form>
    </ReactModal>
  );
}

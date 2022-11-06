import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import EmotionsSelect from 'components/EmotionsSelect';

import styles from 'styles/ModalEditEmotion.module.scss';

export default function ModalRecordEmotions({ isOpen, handleClose, onSubmit, record }) {
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
          <button type="button" onClick={handleClose}>
            close
          </button>
          <button>save</button>
        </div>
      </form>
    </ReactModal>
  );
}

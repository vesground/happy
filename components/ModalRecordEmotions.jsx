import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import cn from 'classnames';

import EmotionsSelect from 'components/select';

import styles from 'styles/Modal.module.scss';
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
        <div className={cn(styles.buttonGroup, styles.buttonGroupBottomRight)}>
          <Button type="button" onClick={handleClose} disabled={loading}>
            close
          </Button>
          <Button type="submit" loading={loading} onClick={handleSubmit}>save</Button>
        </div>
    </ReactModal>
  );
}

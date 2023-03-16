import ReactModal from 'react-modal';

import styles from 'styles/Modal.module.scss';
import Button from 'components/Button';

export default function ModalRecordReason({ isOpen, handleClose, onSubmit, reason = '', loading }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const reason = event.target[0].value;

    onSubmit({ reason });
  }

  return (
    <ReactModal isOpen={isOpen} contentLabel="Edit emotion">
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea type="text" name="reason" defaultValue={reason} />
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

import ReactModal from 'react-modal';

import styles from 'styles/ModalEditEmotion.module.scss';

export default function ModalEditEmotion({ isOpen, handleClose, onSubmit, reason = '' }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const reason = event.target[0].value;

    onSubmit(reason);
  }

  return (
    <ReactModal isOpen={isOpen} contentLabel="Edit emotion">
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea type="text" name="reason" defaultValue={reason} />
        <div className={styles.buttonGroup}>
          <button onClick={handleClose}>cancel</button>
          <button type="submit">save</button>
        </div>
      </form>
    </ReactModal>
  );
}

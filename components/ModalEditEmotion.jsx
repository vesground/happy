import ReactModal from 'react-modal';

import styles from 'styles/ModalEditEmotion.module.scss';

export default function ModalEditEmotion({ isOpen, handleClose, emotionId }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const reason = event.target[0].value;

    const data = {
      userId: 1,
      emotionId,
      reason,
    };

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    handleClose();
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

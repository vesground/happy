import { useState, useRef } from 'react';

import Layout from 'components/Layout';
import withAuthentication from 'components/withAuthentication';
import ModalEditEmotion from 'components/ModalRecordReason';
import Button from 'components/select/Button';
import EmotionsSelect from 'components/select';

import styles from 'styles/Home.module.scss';

function Home({unauthorized, user}) {
  const [selected, setSelected] = useState([]);
  const selectorRef = useRef();

  const [openedModal, setOpenedModal] = useState(false);

  const handleSelect = (emotionId) => () => {
    const isSelected = selected.includes(emotionId);
    setSelected((selected) => (isSelected ? selected.filter((id) => id !== emotionId) : [...selected, emotionId]));
  };

  async function createRecord({ reason }) {
    const data = {
      userId: user.id,
      emotions: selected,
      reason,
    };

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    setOpenedModal(false);

    setSelected([])
    selectorRef.current.close();
  }

  function openModal() {
    setOpenedModal(true);
  }

  function closeModal() {
    setOpenedModal(false);
  }

  return (
    <Layout alignY loading={unauthorized}>
      <EmotionsSelect selected={selected} onChange={handleSelect} onSubmit={openModal} ref={selectorRef} />

      <ModalEditEmotion isOpen={openedModal} handleClose={closeModal} onSubmit={createRecord} />
    </Layout>
  );
}

export default withAuthentication(Home);

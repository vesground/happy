import { useState, useRef } from 'react';

import Layout from 'lib/Layout';
import withAuthentication from 'components/withAuthentication';
import ModalEditEmotion from 'components/ModalRecordReason';
import EmotionsSelect from 'lib/select';

function Home({ unauthorized, user }) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const selectorRef = useRef();

  const [openedModal, setOpenedModal] = useState(false);

  const handleSelect = (emotionId) => () => {
    const isSelected = selected.includes(emotionId);
    setSelected((selected) => (isSelected ? selected.filter((id) => id !== emotionId) : [...selected, emotionId]));
  };

  async function createRecord({ reason }) {
    setLoading(true);
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

    setSelected([]);
    selectorRef.current.close();
    setLoading(false);
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

      <ModalEditEmotion isOpen={openedModal} handleClose={closeModal} onSubmit={createRecord} loading={loading} />
    </Layout>
  );
}

export default withAuthentication(Home);

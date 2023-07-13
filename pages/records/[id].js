import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'utils/swr';
import { pickBy, identity } from 'lodash';
import { useRouter } from 'next/router';

import Layout from 'lib/Layout';
import withAuthentication from 'components/withAuthentication';
import ModalEditEmotion from 'components/ModalRecordReason';
import ModalRecordEmotions from 'components/ModalRecordEmotions';
import RecordEmotion from 'components/RecordEmotion';
import RecordReason from 'components/RecordReason';

import { MODAL_RECORD_EMOTIONS, MODAL_RECORD_REASON } from 'utils/consts';
import { insertUpdatedRecord } from 'utils/helpers';

import styles from 'styles/Dashboard.module.scss';

function Record() {
  const router = useRouter();

  const [openedModal, setOpenedModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: record, mutate } = useSWR(
    () => router.query.id && `${process.env.NEXT_PUBLIC_HOST}/api/records/${router.query.id}`,
    fetcher,
  );

  function openModal(record, type) {
    return function () {
      setOpenedModal({ record, type });
    };
  }

  function closeModal() {
    setOpenedModal(null);
  }

  async function editRecord(newRecord) {
    setLoading(true);
    const body = pickBy(newRecord, identity);

    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records/${record.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const updatedRecord = await response.json();
    const newData = insertUpdatedRecord(record, updatedRecord.data);
    await mutate(newData);

    setLoading(false);
    closeModal();
  }

  return (
    <Layout loading={!record} contentToBottom>
      {record && (
        <div className={styles.record} key={record.id}>
          <RecordEmotion id={record.id} emotions={record.emotions} dayDate={new Date()} openModal={openModal} />
          <RecordReason id={record.id} reason={record.reason} dayDate={new Date()} openModal={openModal} />
        </div>
      )}

      <ModalRecordEmotions
        isOpen={openedModal?.type === MODAL_RECORD_EMOTIONS}
        handleClose={closeModal}
        onSubmit={editRecord}
        record={openedModal?.record}
        loading={loading}
      />

      <ModalEditEmotion
        isOpen={openedModal?.type === MODAL_RECORD_REASON}
        handleClose={closeModal}
        onSubmit={editRecord}
        reason={openedModal?.record.reason}
        loading={loading}
      />
    </Layout>
  );
}

export default withAuthentication(Record);

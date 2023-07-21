import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'utils/swr';
import { pickBy, identity } from 'lodash';
import { useRouter } from 'next/router';
import { Menu, Item, useContextMenu } from 'react-contexify';

import Layout from 'lib/Layout';
import withAuthentication from 'components/withAuthentication';
import ModalEditEmotion from 'components/ModalRecordReason';
import ModalRecordEmotions from 'components/ModalRecordEmotions';
import RecordEmotion from 'components/RecordEmotion';
import RecordReason from 'components/RecordReason';

import { MODAL_RECORD_EMOTIONS, MODAL_RECORD_REASON } from 'utils/consts';
import { insertUpdatedRecord, mapEmotionsIds } from 'utils/helpers';

import 'react-contexify/ReactContexify.css';
import styles from 'styles/Dashboard.module.scss';

const MENU_ID = 'RECORD_ACTIONS_MENU';

function Record() {
  const router = useRouter();
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const [openedModal, setOpenedModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data: record, mutate } = useSWR(
    () => router.query.id && `${process.env.NEXT_PUBLIC_HOST}/api/records/${router.query.id}`,
    fetcher,
  );

  const { data: records } = useSWR(() => {
    if (!record) return null;

    const query = record.emotions.map((emotion) => ['emotions', emotion.id]);
    const exclude = ['exclude', record.id];
    const sortQuery = {
      sortBy: 'createdAt',
      order: 'asc',
    };

    const params = new URLSearchParams([...query, exclude, ...Object.entries(sortQuery)]).toString();

    return `${process.env.NEXT_PUBLIC_HOST}/api/records?${params}`;
  }, fetcher);

  function closeModal() {
    setOpenedModal(null);
  }

  function handleContextMenu(event) {
    show({
      event,
      props: {
        key: 'value',
      },
    });
  }

  function editEmotions() {
    const data = { id: record.id, emotions: record.emotions.map(mapEmotionsIds), dayDate: record.createdAt };
    setOpenedModal({ record: data, type: MODAL_RECORD_EMOTIONS });
  }

  function editReason() {
    const data = { id: record.id, reason: record.reason, dayDate: record.createdAt };
    setOpenedModal({ record: data, type: MODAL_RECORD_REASON });
  }

  async function deleteRecord() {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records/${record.id}`, {
      method: 'DELETE',
    });

    setLoading(false);
    closeModal();
    router.push('/dashboard');
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

  function navigateToRecordPage({ id }) {
    return function () {
      router.replace(`/records/${id}`);
    };
  }

  return (
    <Layout loading={!record} contentToBottom>
      {record && (
        <div className={styles.record} key={record.id} onClick={handleContextMenu}>
          <RecordEmotion id={record.id} emotions={record.emotions} dayDate={new Date()} />
          <RecordReason id={record.id} reason={record.reason} dayDate={new Date()} />
        </div>
      )}

      <h3>Take a look when you have felt the same emotions before:</h3>

      {records?.length &&
        records.map((record) => (
          <div className={styles.record} key={record.id} onClick={navigateToRecordPage({ id: record.id })}>
            <RecordEmotion id={record.id} emotions={record.emotions} dayDate={new Date()} />
            <RecordReason id={record.id} reason={record.reason} dayDate={new Date()} />
          </div>
        ))}

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

      <Menu id={MENU_ID}>
        <Item id="emotions" onClick={editEmotions}>
          Edit emotions
        </Item>
        <Item id="reason" onClick={editReason}>
          Edit reason
        </Item>
        <Item id="delete" onClick={deleteRecord}>
          Delete
        </Item>
      </Menu>
    </Layout>
  );
}

export default withAuthentication(Record);

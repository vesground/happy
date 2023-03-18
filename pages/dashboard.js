import { useState } from 'react';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { fetcher } from 'utils';
import { pickBy, identity } from 'lodash';

import Layout from 'components/Layout';
import withAuthentication from 'components/withAuthentication';
import ModalEditEmotion from 'components/ModalRecordReason';
import ModalRecordEmotions from 'components/ModalRecordEmotions';

import globalStyles from 'styles/global.module.scss';
import styles from 'styles/Dashboard.module.scss';
import Link from 'next/link';

const MODAL_RECORD_EMOTIONS = 'MODAL_RECORD_EMOTIONS';
const MODAL_RECORD_REASON = 'MODAL_RECORD_REASON';

function Dashboard({ user }) {
  const [openedModal, setOpenedModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data, error, mutate } = useSWR(
    () => `${process.env.NEXT_PUBLIC_HOST}/api/records?userId=${user.id}&groupBy=day`,
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
    const cleanedRecord = pickBy(newRecord, identity);

    const body = {
      id: openedModal.record.id,
      ...cleanedRecord,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const updatedRecord = await response.json();

    const newData = insertUpdatedRecord(data, updatedRecord);
    mutate(newData);

    closeModal();
    setLoading(false);
  }

  const recordsDates = Object.keys(data || {})

  return (
    <Layout loading={!data} contentToBottom>
      {recordsDates?.length ? recordsDates.map((dayDate) => {
        const records = data[dayDate];
        return (
          <>
            <h3>{dayjs(dayDate).format('DD/MM')}</h3>
            {records.map(({ id, emotions, reason }) => (
              <div className={styles.record} key={id}>
                <RecordEmotion id={id} emotions={emotions} dayDate={dayDate} openModal={openModal} />
                <RecordReason id={id} reason={reason} dayDate={dayDate} openModal={openModal} />
              </div>
            ))}
          </>
        );
      }): <p>No records. Go and add some <Link href='/'>here</Link></p>}

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

function RecordEmotion({ id, emotions, dayDate, openModal }) {
  return (
    <p
      className={globalStyles.textRegular}
      onClick={openModal({ id, emotions: emotions.map(mapEmotionsIds), dayDate }, MODAL_RECORD_EMOTIONS)}
    >
      {emotions.map((emotion, index) => (
        <span key={index}>
          {0 === index ? emotion.name : emotion.name.toLowerCase()}
          {emotions.length - 1 === index ? '' : ', '}
        </span>
      ))}
    </p>
  );
}

function RecordReason({ id, reason, dayDate, openModal }) {
  return (
    <p className={globalStyles.textSmall} onClick={openModal({ id, reason, dayDate }, MODAL_RECORD_REASON)}>
      {reason}
    </p>
  );
}

function mapEmotionsIds(emotion) {
  return emotion.id;
}

function insertUpdatedRecord(data, updated) {
  const newData = { ...data };

  const dayStartAt = dayjs(updated.createdAt).startOf('day');
  const dayRecordIndex = newData[dayStartAt].findIndex((record) => record.id === updated.id);
  newData[dayStartAt][dayRecordIndex] = updated;

  return newData;
}

export default withAuthentication(Dashboard);

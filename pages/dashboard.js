import { useState } from 'react';
import useSWR from 'swr';
import dayjs from 'dayjs';
import { fetcher } from 'utils/swr';
import { pickBy, identity } from 'lodash';
import utc from 'dayjs/plugin/utc';
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
import Link from 'next/link';

dayjs.extend(utc);

function Dashboard({ user }) {
  const router = useRouter();

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
    const body = pickBy(newRecord, identity);

    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records/${openedModal.record.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const updatedRecord = await response.json();
    const newData = insertUpdatedRecord(data, updatedRecord.data);
    await mutate(newData);

    setLoading(false);
    closeModal();
  }

  function navigateToRecordPage({ id }) {
    return function () {
      router.push(`/records/${id}`);
    };
  }

  const recordsDates = Object.keys(data || {});

  return (
    <Layout loading={!data} contentToBottom>
      {recordsDates?.length ? (
        recordsDates.map((dayDate) => {
          const records = data[dayDate];
          return (
            <>
              <h3>{dayjs(dayDate).format('DD/MM')}</h3>
              {records.map(({ id, emotions, reason }) =>
                process.env.NODE_ENV === 'production' ? (
                  <Record
                    key={id}
                    id={id}
                    emotions={emotions}
                    reason={reason}
                    dayDate={dayDate}
                    openModal={openModal}
                  />
                ) : (
                  <NewRecord
                    key={id}
                    id={id}
                    emotions={emotions}
                    reason={reason}
                    dayDate={dayDate}
                    navigateToRecordPage={navigateToRecordPage}
                  />
                ),
              )}
            </>
          );
        })
      ) : (
        <p>
          Empty list. Go and add new records <Link href="/">here</Link>.
        </p>
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

function Record({ id, emotions, reason, dayDate, openModal }) {
  return (
    <div className={styles.record} key={id}>
      <RecordEmotion id={id} emotions={emotions} dayDate={dayDate} openModal={openModal} />
      <RecordReason id={id} reason={reason} dayDate={dayDate} openModal={openModal} />
    </div>
  );
}

function NewRecord({ id, emotions, reason, dayDate, navigateToRecordPage }) {
  return (
    <div className={styles.record} key={id}>
      <RecordEmotion id={id} emotions={emotions} dayDate={dayDate} openModal={navigateToRecordPage} />
      <RecordReason id={id} reason={reason} dayDate={dayDate} openModal={navigateToRecordPage} />
    </div>
  );
}

export default withAuthentication(Dashboard);

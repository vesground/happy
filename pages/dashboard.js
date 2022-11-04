import { useState } from 'react';
import useSWR from 'swr';
import dayjs from 'dayjs';

import Layout from 'components/Layout';
import withAuthentication from 'components/withAuthentication';
import ModalEditEmotion from 'components/ModalEditEmotion';
import { fetcher } from 'utils';

import globalStyles from 'styles/global.module.scss';
import styles from 'styles/Dashboard.module.scss';

function Dashboard({ user }) {
  const [record, setRecord] = useState(null);
  const { data, error, mutate } = useSWR(
    () => `${process.env.NEXT_PUBLIC_HOST}/api/records?userId=${user.id}&groupBy=day`,
    fetcher,
  );

  function openModal(record) {
    return function () {
      setRecord(record);
    };
  }

  function closeModal() {
    setRecord(null);
  }

  async function changeDescription(reason) {
    const body = {
      id: record.id,
      reason,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/records`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const updatedRecord = await response.json();

    const newData = insertUpdatedRecord(data, updatedRecord);
    mutate(newData);

    closeModal();
  }

  return (
    <Layout loading={!data}>
      {Object.keys(data || []).map((dayDate) => {
        const records = data[dayDate];
        return (
          <>
            <h3>{dayjs(dayDate).format('DD/MM')}</h3>
            {records.map(({ id, emotions, reason }) => (
              <div className={styles.record} key={id}>
                <p className={globalStyles.textRegular}>{emotions[0].name}</p>
                {reason && (
                  <p className={globalStyles.textSmall} onClick={openModal({ id, reason, dayDate })}>
                    {reason}
                  </p>
                )}
              </div>
            ))}
          </>
        );
      })}

      <ModalEditEmotion
        isOpen={!!record}
        handleClose={closeModal}
        onSubmit={changeDescription}
        reason={record?.reason}
      />
    </Layout>
  );
}

function insertUpdatedRecord(data, updated) {
  const newData = { ...data };

  const dayStartAt = dayjs(updated.createdAt).startOf('day');
  const dayRecordIndex = newData[dayStartAt].findIndex((record) => record.id === updated.id);
  newData[dayStartAt][dayRecordIndex] = updated;

  return newData;
}

export default withAuthentication(Dashboard);

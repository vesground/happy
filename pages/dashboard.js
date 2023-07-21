import useSWR from 'swr';
import dayjs from 'dayjs';
import { fetcher } from 'utils/swr';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';

import Layout from 'lib/Layout';
import withAuthentication from 'components/withAuthentication';
import RecordEmotion from 'components/RecordEmotion';
import RecordReason from 'components/RecordReason';

import styles from 'styles/Dashboard.module.scss';
import Link from 'next/link';

dayjs.extend(utc);

function Dashboard({ user }) {
  const router = useRouter();

  const { data } = useSWR(
    () => `${process.env.NEXT_PUBLIC_HOST}/api/records?userId=${user.id}&groupBy=day&sortBy=createdAt&order=desc`,
    fetcher,
  );

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
              {records.map(({ id, emotions, reason }) => (
                <div className={styles.record} key={id}>
                  <RecordEmotion id={id} emotions={emotions} dayDate={dayDate} openModal={navigateToRecordPage} />
                  <RecordReason id={id} reason={reason} dayDate={dayDate} openModal={navigateToRecordPage} />
                </div>
              ))}
            </>
          );
        })
      ) : (
        <p>
          Empty list. Go and add new records <Link href="/">here</Link>.
        </p>
      )}
    </Layout>
  );
}

export default withAuthentication(Dashboard);

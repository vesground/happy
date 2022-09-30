import useSWR from 'swr';
import dayjs from 'dayjs';

import Layout from 'components/Layout';
import withAuthentication from 'components/withAuthentication';

import globalStyles from 'styles/global.module.scss';
import styles from 'styles/Dashboard.module.scss';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Dashboard() {
  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/records?userId=1&groupBy=day`, fetcher);

  return (
    <Layout loading={!data}>
      {Object.keys(data || []).map((dayDate) => {
        const records = data[dayDate];
        return (
          <>
            <h3>{dayjs(dayDate).format('DD/MM')}</h3>
            {records.map(({ id, emotion, reason }) => (
              <div className={styles.record} key={id}>
                <p className={globalStyles.textRegular}>{emotion.name}</p>
                {reason && <p className={globalStyles.textSmall}>{reason}</p>}
              </div>
            ))}
          </>
        );
      })}
    </Layout>
  );
}

export default withAuthentication(Dashboard);

import useSWR from 'swr';

import Layout from 'components/Layout';

import globalStyles from 'styles/global.module.scss';
import styles from 'styles/Dashboard.module.scss';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Dashboard() {
  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/records?userId=1`, fetcher);

  return (
    <Layout loading={!data}>
      {data?.map(({ id, emotion, reason }) => (
        <div className={styles.record} key={id}>
          <p className={globalStyles.textRegular}>{emotion.name}</p>
          {reason && <p className={globalStyles.textSmall}>{reason}</p>}
        </div>
      ))}
    </Layout>
  );
}

import useSWR from 'swr';

import Layout from 'components/Layout';

import globalStyles from 'styles/global.module.css';
import styles from 'styles/Dashboard.module.css';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Dashboard() {
  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/records?userId=1`, fetcher);
  if (!data) return 'loading...';

  return (
    <Layout>
      {data?.map(({ id, emotion, reason }) => (
        <div className={styles.record} key={id}>
          <p className={globalStyles.textRegular}>{emotion.name}</p>
          {reason && <p className={globalStyles.textSmall}>{reason}</p>}
        </div>
      ))}
    </Layout>
  );
}

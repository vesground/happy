import useSWR from 'swr';

import Layout from 'components/Layout';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Dashboard() {
  const { data, error } = useSWR(() => `${process.env.NEXT_PUBLIC_HOST}/api/records?userId=1`, fetcher);
  if (!data) return 'loading...';

  return (
    <Layout>
      {data?.map(({ id, emotion }) => (
        <p key={id}>{emotion.name}</p>
      ))}
    </Layout>
  );
}

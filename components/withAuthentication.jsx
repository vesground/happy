import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function withAuthentication(WrappedComponent) {
  return function Component() {
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status !== 'loading' && status === 'unauthenticated') {
        router.replace({
          pathname: '/auth/signin',
          query: { redirectUrl: `${process.env.NEXT_PUBLIC_HOST}${router.asPath}` },
        });
      }
    }, [status]);

    return <WrappedComponent user={data?.user} unauthorized={status === 'loading' || status === 'unauthenticated'} />;
  };
}

import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function withAuthentication(WrappedComponent) {
  return function Component() {
    const { data, status } = useSession();

    useEffect(() => {
      if (status !== 'loading' && status === 'unauthenticated') {
        signIn();
      }
    }, [status]);

    return <WrappedComponent />;
  };
}

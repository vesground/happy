import { SessionProvider } from 'next-auth/react';
import withMobileSafariOnly from 'components/withMobileSafariOnly';

import '../styles/globals.css';

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default withMobileSafariOnly(App)

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import cn from 'classnames';
import { signOut } from 'next-auth/react';

import Loader from 'components/Loader';

import styles from 'styles/Layout.module.scss';

export default function Layout({ children, loading, alignY, alignX, noNavigation }) {
  const [signingOut, setSigningOut] = useState(false);

  async function handleSingOutClick() {
    setSigningOut(true);
    await signOut({redirect: false})
    setSigningOut(false);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Emotional</title>
        <meta name="description" content="Learn your emotions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {(!noNavigation && !signingOut) && (
        <div className={cn(styles.header, loading && styles.hide)}>
          <Link href="/">
            <span style={{ marginRight: '8px' }}>home</span>
          </Link>
          <Link href="/dashboard">
            <span style={{ marginRight: '8px' }}>dashboard</span>
          </Link>
          <span className={styles.logout} onClick={handleSingOutClick}>
            logout
          </span>
        </div>
      )}

      {(loading || signingOut) ? (
        <Loader className={styles.loader} />
      ) : (
        <main
          className={cn(
            styles.main,
            loading && styles.hide,
            alignY && styles.alignCenterY,
            alignX && styles.alignCenterX,
          )}
        >
          {children}
        </main>
      )}
    </div>
  );
}

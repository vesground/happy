import Head from 'next/head';
import Link from 'next/link';
import cn from 'classnames';
import { useRouter } from 'next/router';

import Loader from 'lib/Loader';

import styles from 'styles/Layout.module.scss';

export default function Layout({ children, loading, alignY, alignX, noNavigation, contentToBottom }) {
  const router = useRouter();

  return (
    <div className={cn(styles.container, !contentToBottom && styles.bottomPadding)}>
      <Head>
        <title>Emotional</title>
        <meta name="description" content="Learn your emotions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!noNavigation && (
        <div className={cn(styles.header, loading && styles.hide)}>
          <Link href="/">
            <span className={cn(router.pathname === '/' && styles.opened)}>home</span>
          </Link>
          <Link href="/dashboard">
            <span className={cn(router.pathname === '/dashboard' && styles.opened)}>dashboard</span>
          </Link>

          <Link href="/profile" shallow={true}>
            <span className={styles.logout}>profile</span>
          </Link>
        </div>
      )}

      {loading ? (
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

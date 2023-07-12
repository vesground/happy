import cn from 'classnames';

import styles from 'styles/Loader.module.scss';

export default function Loader({ className }) {
  return (
    <div className={cn(className, styles.running)}>
      <div className={styles.outer}>
        <div className={styles.body}>
          <div className={cn(styles.arm, styles.behind)} />
          <div className={cn(styles.arm, styles.front)} />
          <div className={cn(styles.leg, styles.behind)} />
          <div className={cn(styles.leg, styles.front)} />
        </div>
      </div>
    </div>
  );
}

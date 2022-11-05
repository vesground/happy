import cn from 'classnames';

import styles from 'styles/Button.module.scss';

export default function Button({ className, type, children, ...props }) {
  return (
    <button
      className={cn(styles.button, className, {
        [styles.secondary]: type === 'secondary',
        [styles.icon]: type === 'icon',
      })}
      {...props}
    >
      {children}
    </button>
  );
}

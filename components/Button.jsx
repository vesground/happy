import cn from 'classnames';

import styles from 'styles/Button.module.scss';

export default function Button({ children, className, onClick, loading, ...props }) {
  return (
    <button
      className={cn(styles.button, loading && styles.loading, className)}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {children}
    </button>
  );
  }
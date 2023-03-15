import cn from 'classnames';

import styles from 'styles/select/Button.module.scss';

export default function Button({ className, type, children, disabled, ...props }) {
  return (
    <button
      className={cn(styles.button, className, {
        [styles.secondary]: type === 'secondary' || disabled,
        [styles.icon]: type === 'icon' && !disabled,
      })}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

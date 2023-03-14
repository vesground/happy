import styles from 'styles/Input.module.scss';

export default function Input({ name, register, required, type, placeholder, error }) {
  return (
    <div className={styles.input}>
      <input type={type} placeholder={placeholder} {...register(name, { required })} />
      {error && <span className={styles.error}>{error.message || "This is required"}</span>}
    </div>
  );
}

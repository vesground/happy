import styles from 'styles/Input.module.scss';

export default function Input({ name, register, required, error, ...inputProps }) {
  return (
    <div className={styles.input}>
      <input {...register(name, { required })} {...inputProps} />
      {error && <span className={styles.error}>{error.message || "This is required"}</span>}
    </div>
  );
}

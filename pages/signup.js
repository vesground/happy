import Layout from 'components/Layout';

import styles from 'styles/Signup.module.scss';

function Signup() {
  async function handleSubmit(event) {
    event.preventDefault();

    const formElm = event.target;
    const name = formElm[0].value;
    const password = formElm[1].value;

    const data = { name, password };

    fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    formElm.reset();
  }

  return (
    <Layout alignY alignX noNavigation>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="name" />
        <input type="text" name="password" placeholder="password" />
        <button type="submit">signup</button>
      </form>
    </Layout>
  );
}

export default Signup;

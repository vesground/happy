import { useState } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import cn from "classnames";

import Layout from 'components/Layout';
import { Requests } from "utils/request";

import styles from 'styles/Signup.module.scss';

function Signup() {
  const [authorizing, setAuthorizing] = useState(false)
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault();

    const formElm = event.target;
    const name = formElm[0].value;
    const password = formElm[1].value;

    const data = { name, password };

    setAuthorizing(true)

    try {
      await Requests.post('/api/users', data)
    } catch (e) {
      setAuthorizing(false)
      return;
    }
 
    await signIn('auth-provider', {username: name, password, redirect: false})

    router.push('/')
  }

  function handleLoginClick() {
    router.replace('/auth/signin')
  }

  return (
    <Layout alignY alignX noNavigation>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="name" />
        <input type="text" name="password" placeholder="password" />
        <button type="submit" className={cn(authorizing && styles.buttonLoading)} disabled={authorizing}>Sign Up</button>

        <p>Have an account? <a onClick={handleLoginClick}>Login</a></p>
      </form>
    </Layout>
  );
}

export default Signup;

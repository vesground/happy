import { useState } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import cn from "classnames";

import Layout from 'components/Layout';

import styles from 'styles/Signup.module.scss';

function Signin() {
  const [authorizing, setAuthorizing] = useState(false)
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault();

    const formElm = event.target;
    const username = formElm[0].value;
    const password = formElm[1].value;

    setAuthorizing(true)
    const data = { username, password, redirect: false}
    await signIn('auth-provider', data)

    formElm.reset();
    router.replace(router.query.redirectUrl || '/')
  }

  function handleSignupClick() {
    router.replace('/auth/signup')
  }

  return (
    <Layout alignY alignX noNavigation>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="name" />
        <input type="text" name="password" placeholder="password" />
        <button type="submit" className={cn(authorizing && styles.buttonLoading)} disabled={authorizing}>Login</button>

        <p>New here? <a onClick={handleSignupClick}>Sign up</a></p>
      </form>
    </Layout>
  );
}

export default Signin;

import { useState } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import cn from "classnames";
import { useForm } from "react-hook-form";

import Layout from 'components/Layout';
import Input from 'components/Input';

import styles from 'styles/Signup.module.scss';

function Signin() {
  const [authorizing, setAuthorizing] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit({name, password}) {
    setAuthorizing(true)
    await signIn('auth-provider', { username: name, password, redirect: false})

    router.replace(router.query.redirectUrl || '/')
  }

  function handleSignupClick() {
    router.replace('/auth/signup')
  }

  return (
    <Layout alignY alignX noNavigation>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input register={register} type="text" name="name" placeholder="name" required error={errors.name} />
        <Input register={register} type="text" name="password" placeholder="password" required error={errors.password} />
        <button type="submit" className={cn(authorizing && styles.buttonLoading)} disabled={authorizing}>Login</button>

        <p>New here? <a onClick={handleSignupClick}>Sign up</a></p>
      </form>
    </Layout>
  );
}

export default Signin;

import { useState } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import cn from "classnames";
import { useForm } from "react-hook-form";

import Layout from 'components/Layout';
import Input from 'components/Input';
import Button from 'components/Button';
import { Requests } from "utils/request";

import styles from 'styles/Signup.module.scss';

function Signup() {
  const [authorizing, setAuthorizing] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  async function onSubmit({name, password}) {
    setAuthorizing(true)

    try {
      await Requests.post('/api/users', { name, password })
    } catch (e) {
      setError('name', { message: 'This name is already taken'}, { shouldFocus: true})
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
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Input register={register} type="text" name="name" placeholder="name" required error={errors.name} />
        <Input register={register} type="text" name="password" placeholder="password" required error={errors.password} />
        <Button type="submit" loading={authorizing}>Sign Up</Button>

        <p>Have an account? <a onClick={handleLoginClick}>Login</a></p>
      </form>
    </Layout>
  );
}

export default Signup;

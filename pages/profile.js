import { useState, useRef } from 'react';
import { signOut } from 'next-auth/react';

import Layout from 'lib/Layout';
import withAuthentication from 'components/withAuthentication';

function Home({ unauthorized, user }) {
  async function handleSingOutClick() {
    signOut({ redirect: true });
  }

  console.log(unauthorized);

  return (
    <Layout alignY loading={unauthorized}>
      <p>{user?.name}</p>
      <p>
        language: <span>en</span>
      </p>
      <p onClick={handleSingOutClick}>logout</p>
    </Layout>
  );
}

export default withAuthentication(Home);

import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { getByName } from 'services/users';

export const authOptions = {
  // Configure one or more authentication providers
  secret: 'rYJ5UmhCHKXIMq73toFm',
  providers: [
    CredentialsProvider({
      id: 'auth-provider',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const user = await getByName(credentials.username);
        const matched = await bcrypt.compare(credentials.password, user.password);

        if (matched) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      user && (token.user = user);
      return token;
    },
    // Send properties to the client, like an access_token from a provider.
    async session({ session, token, user }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
export default NextAuth(authOptions);

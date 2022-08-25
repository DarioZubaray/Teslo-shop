import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Credentals from 'next-auth/providers/credentials'
import { dbUsers } from '../../../database';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentals({
      name: 'Custom login',
      credentials: {
        email: { label: 'correo', type: 'email', placeholder: 'Ingresa tu correo'},
        password: { label: 'contraseña', type: 'password', placeholder: 'Contraseña'},
      },
      async authorize(credentials) {

        return await dbUsers.checkUserEmailPassword(credentials!.email!, credentials!.password);
      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

  ],

  pages: {
    signIn: '/auth, login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, // 30d
    strategy: 'jwt',
    updateAge: 86400,
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if ( account ) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'credentials':
            token.user = user;
            break;
          case 'oauth':
            token.user = await dbUsers.oAuthToDBUser(user?.email || '', user?.name || '')
            break;
        }
      }

      return token;
    },

    async session({ session, token }) {

      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  }
})
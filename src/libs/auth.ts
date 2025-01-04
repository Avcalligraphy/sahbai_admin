import CredentialProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              identifier: email,
              password: password
            })
          })

          const data = await response.json()

          if (response.ok && data.jwt) {
            // Tambahkan pengecekan role
            if (data.user.roleUser !== 'admin' && data.user.roleUser !== 'school' && data.user.roleUser !== 'teacher') {
              throw new Error('Access Denied: Admin access required')
            }

            return {
              id: data.user.id,
              name: data.user.username,
              email: data.user.email,
              phone: data.user.phone,
              jwt: data.jwt,
              role: data.user.roleUser || 'user'
            }
          }

          return null
        } catch (e: any) {
          throw new Error(e.message)
        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  pages: {
    signIn: '/login'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number
        token.name = user.name ?? undefined
        token.email = user.email ?? undefined
        token.phone = user.phone ?? undefined
        token.jwt = user.jwt
        token.role = user.role === 'admin' || user.role === 'school' || user.role === 'teacher' ? user.role : 'user'

        console.log('JWT Callback - User Role:', token.role)
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.role =
          token.role === 'admin' || token.role === 'school' || token.role === 'teacher' ? token.role : 'user'
        session.user.phone = token.phone

        // Optionally add JWT to session if needed
        // @ts-ignore
        if (token.role !== 'admin' && token.role !== 'school' && token.role !== 'teacher') {
          throw new Error('Access Denied: Admin access required')
        }

        session.jwt = token.jwt
      }

      return session
    }
  }
}

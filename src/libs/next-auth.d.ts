import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: number
    name?: string | null
    email?: string | null
    jwt?: string
    role?: 'admin' | 'school' | 'user' | 'teacher'
    phone?: string
  }

  export interface Session {
    user: User
    jwt?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    name?: string
    email?: string
    jwt?: string
    role?: string
    phone?: string
  }
}

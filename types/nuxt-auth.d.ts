import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /* Returned by `useAuth`, `getSession` and `getServerSession` */
  interface Session extends DefaultSession {
    user: User
  }
}

declare module '#auth' {
  interface SessionData {
    user: User
  }
}

export {}

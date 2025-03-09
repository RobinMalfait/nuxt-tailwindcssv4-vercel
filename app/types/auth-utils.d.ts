declare module '#auth-utils' {
  interface User {
    token: string
    data: any
  }

  // interface UserSession {
  //   // Add your own fields
  // }

  interface SecureSessionData {
    refreshToken: string
  }
}

export {}

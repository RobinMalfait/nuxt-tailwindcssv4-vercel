export const usePatUserSession = () => {
  const userSession = useUserSession()
  const { data: userData, signOut, refresh, status } = useAuth()
  type UserRoles = 'ROLE_USER'|'ROLE_ADMIN'

  const hasRole = (role: UserRoles) => {
    return userSession.user.value?.data?.roles?.includes(role)
  }

  const isAdmin = computed(() => hasRole('ROLE_ADMIN'))

  return {
    userData,
    userSession,
    hasRole,
    signOut,
    refresh,
    isAdmin,
    status
  }
}

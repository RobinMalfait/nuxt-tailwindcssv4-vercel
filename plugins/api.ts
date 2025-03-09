export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const localConfig = runtimeConfig.public.auth.provider;
  if (localConfig.type !== 'local' || !localConfig.token.cookieName) {
    throw Error('Auth provider config error')
  }
  const authHeaderName = (localConfig.token.headerName || 'authorization').toLowerCase()
  const cookieName = 'nuxt-session'

  const { setToken } = useAuthState()
  const { token } = useAuth()
  const sessionCookie = useCookie(cookieName)
  const baseURL = import.meta.server ? runtimeConfig.public.apiUrl : runtimeConfig.public.apiUrlBrowser

  const api = $fetch.create({
    baseURL,
    credentials: "include",
    retry: 1,
    retryStatusCodes: [403, 408, 409, 425, 429, 500, 502, 503, 504],
    onRequest(context) {
      if (context.options.body instanceof FormData) {
        // context.options.headers.set('content-type', 'multipart/form-data')
      } else {
        context.options.headers.set('content-type', 'application/json')
      }
      if (token.value) {
        context.options.headers.set(authHeaderName, token.value)
      }
      if (sessionCookie.value) {
        context.options.headers.set('cookie', `${cookieName}=${sessionCookie.value}`)
      }
    },
    async onResponseError({ response, options, request }) {
      if (response?.status === 403) {
        await nuxtApp.runWithContext(async () => {
          // we are unauthorized so let us see if we ahve a refresh token in secure storage for the user session to use
          try {
            const response = await $fetch<{ token?: string }>(`/api/auth/refresh`, {
              method: 'post',
              headers: options.headers,
              credentials: "include"
            })
            if (!response.token) {
              throw Error('No new token returned')
            }
            setToken(response.token)
          } catch (error) {
            const requestUrl = request.toString()
            const redirect = options.baseURL ? requestUrl.replace(options.baseURL, '') : requestUrl
            const { signOut } = useAuth()
            await signOut({ callbackUrl: '/sign-in?redirect=' + encodeURIComponent(redirect) })
          }
        })
      }
    }
  })
  return {
    provide: {
      api
    }
  }
})

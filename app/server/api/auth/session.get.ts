import { defineAuthResponseHandler } from "~/server/utils/authResponseHandler";
import {FetchError} from "ofetch";
import { createError, getRequestHeader } from '#imports'
// @ts-ignore-next-line
import {type SupportedAuthProviders} from "@sidebase/nuxt-auth/dist/runtime/types";
// @ts-ignore-next-line
import {type ProviderAuthjsResolvedConfig, type ProviderLocalResolvedConfig} from "@sidebase/nuxt-auth/dist/runtime/helpers";
import type { DeepRequired } from 'ts-essentials'

function useTypedBackendConfig<T extends SupportedAuthProviders>(
  runtimeConfig: ReturnType<typeof useRuntimeConfig>,
  type: T
): ProviderAuthjsResolvedConfig | ProviderLocalResolvedConfig {
  const provider = runtimeConfig.public.auth.provider
  if (provider.type === type) {
    return provider as DeepRequired<typeof provider>
  }

  throw new Error('RuntimeError: Type must match at this point')
}

export default defineAuthResponseHandler(async (event) => {
  const config = useTypedBackendConfig(useRuntimeConfig(), 'local')
  const getUser = async (authToken?: string) => {
    if (!event.context.auth || !event.context.jwtDecoded) {
      setResponseStatus(event, 401)
      return
    }
    const headers: { [name: string]: string } = {}
    if (authToken) {
      headers[config.token.headerName] = `${config.token.type} ${authToken}`
    }

    return await event.context.$api(`/users/${event.context.jwtDecoded.id}`, {
      method: 'get',
      credentials: "include",
      headers
    })
  }

  try {
    const user = await getUser()
    setResponseStatus(event, 200)
    return { user }
  } catch (error: any) {
    if (!(error instanceof FetchError)) {
      console.error(error)
      setResponseStatus(event, 500)
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    const responseStatus = error.response?.status || 500
    if (responseStatus === 403) {
      const cookieHeader = getRequestHeader(event, 'cookie')

      // attempt to refresh and set the new auth cookie if successful in the refresh as well as return the user as expected
      try {
        const newTokenResponse = await $fetch<{ token: string }>('/api/auth/refresh', {
          method: 'POST',
          headers: {
            cookie: cookieHeader || ''
          },
          credentials: "include"
        })
        const newToken = newTokenResponse.token
        if (!newToken) {
          throw Error('No new token returned in refresh response')
        }
        const user = await getUser(newToken)

        setCookie(event, config.token.cookieName, newToken, {
          domain: config.token.cookieDomain,
          maxAge: config.token.maxAgeInSeconds,
          sameSite: config.token.sameSiteAttribute,
          secure: config.token.secureCookieAttribute,
          httpOnly: config.token.httpOnlyCookieAttribute
        })
        setResponseStatus(event, 200)
        return { user }
      } catch (refreshError: any) {
        if (!(refreshError instanceof FetchError)) {
          console.error(refreshError)
          setResponseStatus(event, 500)
          throw createError({
            statusCode: 500,
            statusMessage: refreshError.message
          })
        }
        // if a fetch error continue to original response
      }
    }

    setResponseStatus(event, responseStatus)
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.data
    })
  }
})

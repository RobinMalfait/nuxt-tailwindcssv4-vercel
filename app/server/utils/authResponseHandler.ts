import type {EventHandler, EventHandlerRequest, H3Event} from 'h3'
import {getRouteParamAsString} from "~/utils/getRouteParamAsString";
import {jwtDecode} from "jwt-decode";

export const defineAuthResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event: H3Event) => {
    try {
      const { varnishToken, public: { apiUrl, auth: { provider } } } = useRuntimeConfig()
      const localConfig = provider;
      if (localConfig.type !== 'local') {
        throw Error('Auth provider config error')
      }
      const authHeaderName = (localConfig.token.headerName || 'authorization').toLowerCase()
      const authHeaderType = localConfig.token.type || 'Bearer'
      event.context.authHeaderType = authHeaderType
      event.context.authHeaderName = authHeaderName
      event.context.auth = event.node.req.headers[authHeaderName]

      const headers: { [key: string]: string } = {
        'X-AUTH-TOKEN': varnishToken,
        'Accept-Encoding': 'application/json'
      }

      if (event.context.auth) {
        const requestAuthHeader = getRouteParamAsString(event.context.auth)
        event.context.jwt = requestAuthHeader.replace(`/^${authHeaderType} /`, '')
        event.context.jwtDecoded = jwtDecode<{ id: number, username: string, roles: string[], iat: number, exp: number }>(event.context.jwt)
        headers[authHeaderName] = requestAuthHeader
      }

      event.context.$api = $fetch.create({
        baseURL: apiUrl || undefined,
        headers
      })
      return await handler(event)
    } catch (err) {
      // Error handling
      return { err }
    }
  })

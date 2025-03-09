import {defineAuthResponseHandler} from "~/server/utils/authResponseHandler";
import {FetchError} from "ofetch";
import {jwtDecode} from "jwt-decode";

export default defineAuthResponseHandler(async (event) => {
  try {
    const session = await getUserSession(event)
    const body = {
      refresh_token: session.secure?.refreshToken
    }
    const response = await event.context.$api(`/token/refresh`, {
      method: 'POST',
      body
    })
    const token = response?.token
    await replaceUserSession(event, {
      loggedInAt: new Date(),
      user: {
        token,
        data: token ? jwtDecode(token) : undefined
      },
      secure: {
        refreshToken: response?.refresh_token
      }
    })
    setResponseStatus(event, 200)
    return {
      token
    }
  } catch (error) {
    if (!(error instanceof FetchError)) {
      throw error
    }
    const statusCode = error.statusCode || 500
    setResponseStatus(event, statusCode)
    throw createError({
      statusCode,
      statusMessage: statusCode === 401 ? 'Unable to refresh' : error.message
    })
  }
})

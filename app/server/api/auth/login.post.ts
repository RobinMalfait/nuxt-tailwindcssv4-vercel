import { defineAuthResponseHandler } from "~/server/utils/authResponseHandler";
import { FetchError } from "ofetch";
import { jwtDecode } from "jwt-decode";

export default defineAuthResponseHandler(async (event) => {
  try {
    const body = await readBody(event)
    const res = await event.context.$api('/login_check', {
      method: 'POST',
      body: {
        username: body.username,
        password: body.password
      }
    })
    const token = res?.token
    await setUserSession(event, {
      loggedInAt: new Date(),
      user: {
        token,
        data: token ? jwtDecode(token) : undefined
      },
      secure: {
        refreshToken: res?.refresh_token
      }
    }, {
      maxAge: 60 * 60 * 24 * 14 // 14 days
    })
    setResponseStatus(event, 200)
    return {
      token
    }
  } catch (error: any) {
    if (!(error instanceof FetchError)) {
      throw error
    }
    const statusCode = error.statusCode || 500
    setResponseStatus(event, statusCode)
    throw createError({
      statusCode,
      statusMessage: statusCode === 401 ? 'Invalid credentials' : error.message
    })
  }
})

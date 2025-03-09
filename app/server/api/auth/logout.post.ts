import { defineAuthResponseHandler } from "~/server/utils/authResponseHandler";
import { FetchError } from "ofetch";

export default defineAuthResponseHandler(async (event) => {
  try {
    await clearUserSession(event)
    return { response: 'ok' }
  } catch (error: any) {
    if (!(error instanceof FetchError)) {
      throw error
    }
    throw createError({
      statusCode: 400,
      statusMessage: error.data
    })
  }
})

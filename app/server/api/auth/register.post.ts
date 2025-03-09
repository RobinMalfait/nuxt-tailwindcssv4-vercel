import { defineAuthResponseHandler } from "~/server/utils/authResponseHandler";
import { FetchError } from "ofetch";

export default defineAuthResponseHandler(async (event) => {
  try {
    const body = await readBody(event)
    return await event.context.$api('/forms/register/submit', {
      method: 'POST',
      body
    })
  } catch (error: any) {
    if (!(error instanceof FetchError)) {
      throw error
    }
    setResponseStatus(event, error.statusCode)
    return error.data
  }
})

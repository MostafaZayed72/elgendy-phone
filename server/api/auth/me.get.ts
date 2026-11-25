import { ADMIN_COOKIE_NAME, verifySessionToken } from '~~/server/utils/auth'

export default defineEventHandler((event) => {
  const token = getCookie(event, ADMIN_COOKIE_NAME)
  const authenticated = verifySessionToken(token)
  const config = useRuntimeConfig()
  return {
    authenticated,
    username: authenticated ? config.adminUsername : null
  }
})

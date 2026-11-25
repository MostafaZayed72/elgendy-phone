import { ADMIN_COOKIE_NAME } from '~~/server/utils/auth'

export default defineEventHandler((event) => {
  deleteCookie(event, ADMIN_COOKIE_NAME, { path: '/' })
  return { success: true }
})

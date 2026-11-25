import { ADMIN_COOKIE_NAME, createSessionToken } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)
  const config = useRuntimeConfig()

  const username = (body?.username || '').trim()
  const password = body?.password || ''

  if (username !== config.adminUsername || password !== config.adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'اسم المستخدم أو كلمة المرور غير صحيحة'
    })
  }

  const token = createSessionToken(username)
  setCookie(event, ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })

  return {
    success: true,
    username
  }
})

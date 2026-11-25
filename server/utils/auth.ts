import { createHmac } from 'node:crypto'
import type { H3Event } from 'h3'

export const ADMIN_COOKIE_NAME = 'elgendy_admin_session'

function getTokenSecret(): string {
  const config = useRuntimeConfig()
  return `${config.adminUsername}:${config.adminPassword}:elgendy-secret-2026`
}

export function createSessionToken(username: string): string {
  const sig = createHmac('sha256', getTokenSecret()).update(username).digest('hex')
  return `${username}.${sig}`
}

export function verifySessionToken(token?: string | null): boolean {
  if (!token || !token.includes('.')) return false
  const [username, sig] = token.split('.')
  if (!username || !sig) return false
  const config = useRuntimeConfig()
  if (username !== config.adminUsername) return false
  const expected = createHmac('sha256', getTokenSecret()).update(username).digest('hex')
  return sig === expected
}

export function requireAdminAuth(event: H3Event): void {
  const token = getCookie(event, ADMIN_COOKIE_NAME)
  if (!verifySessionToken(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'غير مصرح — يرجى تسجيل الدخول أولاً'
    })
  }
}

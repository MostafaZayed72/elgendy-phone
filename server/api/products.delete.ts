import { requireAdminAuth } from '~~/server/utils/auth'
import { getServerSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  requireAdminAuth(event)

  const body = await readBody<{ id?: string }>(event)
  if (!body?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'معرف المنتج مطلوب'
    })
  }

  const supabase = getServerSupabase()
  if (!supabase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'قاعدة بيانات Supabase غير مهيأة في ملف .env'
    })
  }

  const { error } = await supabase.from('products').delete().eq('id', body.id)
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return { success: true }
})

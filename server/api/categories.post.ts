import { requireAdminAuth } from '~~/server/utils/auth'
import { getServerSupabase } from '~~/server/utils/supabase'
import type { Category } from '~~/app/types/store'

export default defineEventHandler(async (event) => {
  requireAdminAuth(event)

  const body = await readBody<{ category?: Category }>(event)
  if (!body?.category || !body.category.name?.ar) {
    throw createError({
      statusCode: 400,
      statusMessage: 'بيانات القسم غير مكتملة'
    })
  }

  const supabase = getServerSupabase()
  if (!supabase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'قاعدة بيانات Supabase غير مهيأة في ملف .env'
    })
  }

  const c = body.category
  const id = c.id?.trim() || `cat-${Date.now()}`
  const slug =
    c.slug?.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') ||
    `cat-${Date.now()}`

  const { error } = await supabase.from('categories').upsert({
    id,
    slug,
    name_ar: c.name.ar,
    name_en: c.name.en || c.name.ar,
    icon: c.icon || 'smartphone'
  })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return { success: true, id, slug }
})

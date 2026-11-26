import { requireAdminAuth } from '~~/server/utils/auth'
import { getServerSupabase } from '~~/server/utils/supabase'
import type { HeroSettings } from '~~/app/types/store'

export default defineEventHandler(async (event) => {
  requireAdminAuth(event)

  const body = await readBody<{ settings?: HeroSettings }>(event)
  if (!body?.settings) {
    throw createError({
      statusCode: 400,
      statusMessage: 'بيانات الإعدادات مطلوبة'
    })
  }

  const supabase = getServerSupabase()
  if (!supabase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'قاعدة بيانات Supabase غير مهيأة'
    })
  }

  const s = body.settings
  const { error } = await supabase.from('store_settings').upsert({
    id: 'default',
    hero_badge_ar: s.heroBadge?.ar || '',
    hero_badge_en: s.heroBadge?.en || '',
    hero_title_ar: s.heroTitle?.ar || '',
    hero_title_en: s.heroTitle?.en || '',
    hero_tagline_ar: s.heroTagline?.ar || '',
    hero_tagline_en: s.heroTagline?.en || '',
    updated_at: new Date().toISOString()
  })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return { success: true }
})

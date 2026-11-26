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
  const payload: Record<string, any> = {
    id: 'default',
    hero_badge_ar: s.heroBadge?.ar || '',
    hero_badge_en: s.heroBadge?.en || '',
    hero_title_ar: s.heroTitle?.ar || '',
    hero_title_en: s.heroTitle?.en || '',
    hero_tagline_ar: s.heroTagline?.ar || '',
    hero_tagline_en: s.heroTagline?.en || '',
    promo_banner_image: s.promoBannerImage || '',
    promo_banner_enabled: Boolean(s.promoBannerEnabled),
    promo_banner_link: s.promoBannerLink || '',
    updated_at: new Date().toISOString()
  }

  let { error } = await supabase.from('store_settings').upsert(payload)
  while (error && error.message?.includes('promo_banner_')) {
    delete payload.promo_banner_image
    delete payload.promo_banner_enabled
    delete payload.promo_banner_link
    const retry = await supabase.from('store_settings').upsert(payload)
    error = retry.error
  }

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return { success: true }
})

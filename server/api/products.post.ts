import { requireAdminAuth } from '~~/server/utils/auth'
import { getServerSupabase, getUploadedImagesCount } from '~~/server/utils/supabase'
import type { Product } from '~~/app/types/store'

export default defineEventHandler(async (event) => {
  requireAdminAuth(event)

  const body = await readBody<{ product?: Product }>(event)
  if (!body?.product || !body.product.name?.ar) {
    throw createError({
      statusCode: 400,
      statusMessage: 'بيانات المنتج غير مكتملة'
    })
  }

  const supabase = getServerSupabase()
  if (!supabase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'قاعدة بيانات Supabase غير مهيأة في ملف .env'
    })
  }

  const p = body.product
  const productId = p.id?.trim() || `prod-${Date.now()}`
  const config = useRuntimeConfig()
  const maxImages = Number(config.maxImagesLimit || 250)

  // Check if this is a new product or new image that would exceed 250 images
  const { data: existing } = await supabase.from('products').select('id, image').eq('id', productId).maybeSingle()
  if (!existing || existing.image !== p.image) {
    const currentCount = await getUploadedImagesCount(supabase)
    if (!existing && currentCount >= maxImages) {
      throw createError({
        statusCode: 403,
        statusMessage: `تم الوصول إلى الحد الأقصى للصور (${maxImages} صورة)`
      })
    }
  }

  const payload = {
    id: productId,
    category_slug: p.categorySlug || 'smartphones',
    name_ar: p.name.ar,
    name_en: p.name.en || p.name.ar,
    description_ar: p.description?.ar || '',
    description_en: p.description?.en || p.description?.ar || '',
    price: Number(p.price) || 0,
    original_price: p.originalPrice ? Number(p.originalPrice) : null,
    unit_ar: p.unit?.ar || 'قطعة',
    unit_en: p.unit?.en || 'piece',
    image: p.image || '/images/products/iphone-13.jpg',
    badge_ar: p.badge?.ar || null,
    badge_en: p.badge?.en || p.badge?.ar || null,
    colors: Array.isArray(p.colors) ? p.colors : [],
    options: Array.isArray(p.options) ? p.options : [],
    is_hidden: Boolean(p.isHidden),
    is_out_of_stock: Boolean(p.isOutOfStock),
    featured: Boolean(p.featured),
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase.from('products').upsert(payload)
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return { success: true, id: productId }
})

import { requireAdminAuth } from '~~/server/utils/auth'
import { getServerSupabase } from '~~/server/utils/supabase'
import { storeCategories, storeProducts } from '~~/app/data/elgendy-store'

export default defineEventHandler(async (event) => {
  requireAdminAuth(event)

  const supabase = getServerSupabase()
  if (!supabase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'قاعدة بيانات Supabase غير مهيأة في ملف .env'
    })
  }

  const catPayloads = storeCategories.map((c, idx) => ({
    id: c.id,
    slug: c.slug,
    name_ar: c.name.ar,
    name_en: c.name.en,
    icon: c.icon,
    image: c.image || null,
    sort_order: idx
  }))

  let { error: catErr } = await supabase.from('categories').upsert(catPayloads, { onConflict: 'id', ignoreDuplicates: true })
  if (catErr && catErr.message?.includes('image')) {
    const noImgCats = catPayloads.map(({ image, ...rest }) => rest)
    const retry = await supabase.from('categories').upsert(noImgCats, { onConflict: 'id', ignoreDuplicates: true })
    catErr = retry.error
  }
  if (catErr) {
    throw createError({ statusCode: 500, statusMessage: catErr.message })
  }

  const prodPayloads = storeProducts.map((p, idx) => ({
    id: p.id,
    category_slug: p.categorySlug,
    name_ar: p.name.ar,
    name_en: p.name.en,
    description_ar: p.description.ar,
    description_en: p.description.en,
    price: p.price,
    original_price: p.originalPrice || null,
    unit_ar: p.unit.ar,
    unit_en: p.unit.en,
    image: p.image,
    badge_ar: p.badge?.ar || null,
    badge_en: p.badge?.en || null,
    colors: p.colors || [],
    options: p.options || [],
    is_hidden: Boolean(p.isHidden),
    is_out_of_stock: Boolean(p.isOutOfStock),
    featured: Boolean(p.featured),
    sort_order: idx
  }))

  const { error: prodErr } = await supabase.from('products').upsert(prodPayloads, { onConflict: 'id', ignoreDuplicates: true })
  if (prodErr) {
    throw createError({ statusCode: 500, statusMessage: prodErr.message })
  }

  return {
    success: true,
    categoriesCount: catPayloads.length,
    productsCount: prodPayloads.length
  }
})

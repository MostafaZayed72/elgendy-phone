import { storeCategories, storeProducts } from '~~/app/data/elgendy-store'
import { getServerSupabase } from '~~/server/utils/supabase'
import type { Category, Product } from '~~/app/types/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'معرف المنتج مطلوب' })
  }

  const supabase = getServerSupabase()
  if (supabase) {
    try {
      const { data: prodRow, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (!error && prodRow) {
        const [{ data: catRows }, { data: relatedRows }] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order', { ascending: true }),
          supabase
            .from('products')
            .select('*')
            .eq('category_slug', prodRow.category_slug)
            .neq('id', id)
            .eq('is_hidden', false)
            .limit(4)
        ])

        const mapProduct = (p: any): Product => ({
          id: p.id,
          categorySlug: p.category_slug,
          name: { ar: p.name_ar, en: p.name_en },
          description: { ar: p.description_ar || '', en: p.description_en || '' },
          price: Number(p.price) || 0,
          originalPrice: p.original_price ? Number(p.original_price) : undefined,
          unit: { ar: p.unit_ar || 'قطعة', en: p.unit_en || 'piece' },
          image: p.image,
          images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
          badge: p.badge_ar ? { ar: p.badge_ar, en: p.badge_en || p.badge_ar } : undefined,
          colors: Array.isArray(p.colors) ? p.colors : [],
          options: Array.isArray(p.options) ? p.options : [],
          isHidden: Boolean(p.is_hidden),
          isOutOfStock: Boolean(p.is_out_of_stock),
          featured: Boolean(p.featured)
        })

        const categories: Category[] = (catRows || []).map((c: any) => ({
          id: c.id,
          slug: c.slug,
          name: { ar: c.name_ar, en: c.name_en },
          icon: c.icon || 'smartphone'
        }))

        return {
          product: mapProduct(prodRow),
          category: categories.find(c => c.slug === prodRow.category_slug) || null,
          relatedProducts: (relatedRows || []).map(mapProduct)
        }
      }
    } catch (err) {
      console.error('Error fetching single product from Supabase:', err)
    }
  }

  const localProduct = storeProducts.find(p => p.id === id) || null
  if (!localProduct) {
    throw createError({ statusCode: 404, statusMessage: 'المنتج غير موجود' })
  }

  return {
    product: {
      ...localProduct,
      images: localProduct.images?.length ? localProduct.images : [localProduct.image]
    },
    category: storeCategories.find(c => c.slug === localProduct.categorySlug) || null,
    relatedProducts: storeProducts
      .filter(p => p.categorySlug === localProduct.categorySlug && p.id !== id)
      .slice(0, 4)
  }
})

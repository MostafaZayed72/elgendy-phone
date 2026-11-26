import { storeCategories, storeProducts } from '~~/app/data/elgendy-store'
import { getServerSupabase, getUploadedImagesCount } from '~~/server/utils/supabase'
import { isCloudinaryConfigured } from '~~/server/utils/cloudinary'
import type { Category, HeroSettings, Product } from '~~/app/types/store'

const defaultHeroSettings: HeroSettings = {
  heroBadge: {
    ar: 'كتالوج المنتجات الرسمي',
    en: 'Official Product Catalog'
  },
  heroTitle: {
    ar: 'EL-GENDY Mobile Store',
    en: 'EL-GENDY Mobile Store'
  },
  heroTagline: {
    ar: 'خبرة تمتد منذ عام 1999 في عالم الهواتف الذكية والإكسسوارات الأصلية — أحدث الأجهزة، الشواحن السريعة، السماعات، والضمان الحقيقي.',
    en: 'Trusted since 1999 in smartphones & genuine accessories — latest devices, fast chargers, earbuds, and real warranty.'
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const includeHidden = query.includeHidden === '1' || query.includeHidden === 'true'
  const config = useRuntimeConfig()
  const maxImages = Number(config.maxImagesLimit || 250)

  const supabase = getServerSupabase()
  const supabaseConnected = Boolean(supabase)
  const cloudinaryConnected = isCloudinaryConfigured()

  if (supabase) {
    try {
      const [{ data: catRows, error: catErr }, { data: prodRows, error: prodErr }, { data: settingsRow }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('products').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
        supabase.from('store_settings').select('*').eq('id', 'default').maybeSingle()
      ])

      const settings: HeroSettings = settingsRow
        ? {
            heroBadge: {
              ar: settingsRow.hero_badge_ar || defaultHeroSettings.heroBadge.ar,
              en: settingsRow.hero_badge_en || defaultHeroSettings.heroBadge.en
            },
            heroTitle: {
              ar: settingsRow.hero_title_ar || defaultHeroSettings.heroTitle.ar,
              en: settingsRow.hero_title_en || defaultHeroSettings.heroTitle.en
            },
            heroTagline: {
              ar: settingsRow.hero_tagline_ar || defaultHeroSettings.heroTagline.ar,
              en: settingsRow.hero_tagline_en || defaultHeroSettings.heroTagline.en
            }
          }
        : defaultHeroSettings

      if (!catErr && !prodErr && ((catRows && catRows.length > 0) || (prodRows && prodRows.length > 0))) {
        const categories: Category[] = (catRows || []).map((c: any) => {
          const fallbackCat = storeCategories.find(sc => sc.slug === c.slug)
          return {
            id: c.id,
            slug: c.slug,
            name: { ar: c.name_ar, en: c.name_en },
            icon: c.icon || 'smartphone',
            image: c.image || fallbackCat?.image || undefined
          }
        })

        const allProducts: Product[] = (prodRows || []).map((p: any) => ({
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
          colorImages: p.color_images && typeof p.color_images === 'object' ? p.color_images : {},
          rams: Array.isArray(p.rams) ? p.rams : [],
          options: Array.isArray(p.options) ? p.options : [],
          isHidden: Boolean(p.is_hidden),
          isOutOfStock: Boolean(p.is_out_of_stock),
          featured: Boolean(p.featured)
        }))

        const imageCount = await getUploadedImagesCount(supabase)
        const products = includeHidden ? allProducts : allProducts.filter(p => !p.isHidden)

        return {
          source: 'supabase' as const,
          supabaseConnected,
          cloudinaryConnected,
          imageCount,
          maxImages,
          settings,
          categories: categories.length > 0 ? categories : storeCategories,
          products
        }
      }
    } catch (err) {
      console.error('Error loading store from Supabase:', err)
    }
  }

  return {
    source: 'local' as const,
    supabaseConnected,
    cloudinaryConnected,
    imageCount: storeProducts.length,
    maxImages,
    settings: defaultHeroSettings,
    categories: storeCategories,
    products: includeHidden ? storeProducts : storeProducts.filter(p => !p.isHidden)
  }
})

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function getServerSupabase(): SupabaseClient | null {
  const config = useRuntimeConfig()
  const url = (config.public.supabaseUrl as string) || process.env.NUXT_PUBLIC_SUPABASE_URL || ''
  const key =
    (config.supabaseServiceRoleKey as string) ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    (config.public.supabaseAnonKey as string) ||
    process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''

  if (!url || !key || !url.startsWith('http')) {
    return null
  }
  return createClient(url, key)
}

export async function getUploadedImagesCount(supabase: SupabaseClient | null): Promise<number> {
  if (!supabase) return 0
  try {
    const { data, error } = await supabase.from('products').select('image, images')
    if (error || !data) return 0
    const uniqueImages = new Set<string>()
    for (const row of data) {
      if (row.image && typeof row.image === 'string' && row.image.trim()) {
        uniqueImages.add(row.image.trim())
      }
      if (Array.isArray(row.images)) {
        for (const img of row.images) {
          if (img && typeof img === 'string' && img.trim()) {
            uniqueImages.add(img.trim())
          }
        }
      }
    }
    return uniqueImages.size
  } catch {
    return 0
  }
}

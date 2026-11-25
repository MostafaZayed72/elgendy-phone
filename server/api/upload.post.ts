import { requireAdminAuth } from '~~/server/utils/auth'
import { getServerSupabase, getUploadedImagesCount } from '~~/server/utils/supabase'
import { isCloudinaryConfigured, uploadBufferToCloudinary } from '~~/server/utils/cloudinary'

export default defineEventHandler(async (event) => {
  requireAdminAuth(event)

  const config = useRuntimeConfig()
  const maxImages = Number(config.maxImagesLimit || 250)

  // Check 250-image limit in Supabase
  const supabase = getServerSupabase()
  if (supabase) {
    const currentCount = await getUploadedImagesCount(supabase)
    if (currentCount >= maxImages) {
      throw createError({
        statusCode: 403,
        statusMessage: `تم الوصول إلى الحد الأقصى للباقة الحالية (${maxImages} صورة). لا يمكن رفع المزيد من الصور.`
      })
    }
  }

  if (!isCloudinaryConfigured()) {
    throw createError({
      statusCode: 500,
      statusMessage: 'إعدادات Cloudinary غير مكتملة في ملف .env'
    })
  }

  let fileBuffer: Buffer | null = null
  try {
    const parts = await readMultipartFormData(event)
    const filePart = parts?.find(p => p.name === 'file' || p.filename)
    if (filePart && filePart.data && filePart.data.length > 0) {
      fileBuffer = filePart.data
    }
  } catch {
    // fallback to readFormData
  }

  if (!fileBuffer) {
    try {
      const formData = await readFormData(event)
      const file = formData.get('file') as File | null
      if (file && typeof file.arrayBuffer === 'function') {
        fileBuffer = Buffer.from(await file.arrayBuffer())
      }
    } catch {
      // ignore
    }
  }

  if (!fileBuffer || fileBuffer.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'لم يتم إرفاق صورة صالحة للرفع'
    })
  }

  const result = await uploadBufferToCloudinary(fileBuffer, 'elgendy-phone/products')

  return {
    success: true,
    url: result.secure_url,
    public_id: result.public_id,
    maxImages
  }
})

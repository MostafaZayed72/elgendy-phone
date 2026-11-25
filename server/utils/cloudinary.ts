import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

export function isCloudinaryConfigured(): boolean {
  const config = useRuntimeConfig()
  const cloudName = (config.cloudinaryCloudName as string) || process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = (config.cloudinaryApiKey as string) || process.env.CLOUDINARY_API_KEY
  const apiSecret = (config.cloudinaryApiSecret as string) || process.env.CLOUDINARY_API_SECRET
  return Boolean(cloudName && apiKey && apiSecret)
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder = 'elgendy-phone/products'
): Promise<UploadApiResponse> {
  const config = useRuntimeConfig()
  const cloudName = (config.cloudinaryCloudName as string) || process.env.CLOUDINARY_CLOUD_NAME || ''
  const apiKey = (config.cloudinaryApiKey as string) || process.env.CLOUDINARY_API_KEY || ''
  const apiSecret = (config.cloudinaryApiSecret as string) || process.env.CLOUDINARY_API_SECRET || ''

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('بيانات Cloudinary غير مكتملة في ملف .env')
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  })

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('لم يتم استلام استجابة من Cloudinary'))
        resolve(result)
      }
    )
    uploadStream.end(buffer)
  })
}

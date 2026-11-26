export interface LocalizedText {
  ar: string
  en: string
}

export interface ContactNumber {
  id: string
  number: string
  whatsappFormatted?: string
  type: 'whatsapp' | 'mobile' | 'landline'
  isPrimary?: boolean
}

export interface Category {
  id: string
  slug: string
  name: LocalizedText
  icon: 'smartphone' | 'headphones' | 'zap' | 'shield'
  image?: string
}

export interface Product {
  id: string
  name: LocalizedText
  description: LocalizedText
  price: number
  originalPrice?: number
  unit: LocalizedText
  image: string
  images?: string[]
  categorySlug: string
  badge?: LocalizedText
  colors?: string[]
  colorImages?: Record<string, string>
  rams?: string[]
  options?: string[]
  variantPrices?: Record<string, number>
  isHidden?: boolean
  isOutOfStock?: boolean
  featured?: boolean
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  price: number
  selectedOption?: string
  selectedRam?: string
  color?: string
  notes?: string
  selectedImage?: string
}

export interface CustomerInfo {
  name: string
  phone: string
  address: string
  notes: string
}

export interface HeroSettings {
  heroBadge: LocalizedText
  heroTitle: LocalizedText
  heroTagline: LocalizedText
  promoBannerImage?: string
  promoBannerEnabled?: boolean
  promoBannerLink?: string
}

export interface StoreConfig {
  slug: string
  name: LocalizedText
  shortName: string
  since: string
  logo: string
  logoDark: string
  whatsappNumber: string
  contacts: ContactNumber[]
  theme: {
    primary: string
    secondary: string
    accent: string
  }
}

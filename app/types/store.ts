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
}

export interface Product {
  id: string
  name: LocalizedText
  description: LocalizedText
  price: number
  originalPrice?: number
  unit: LocalizedText
  image: string
  categorySlug: string
  badge?: LocalizedText
  colors?: string[]
  options?: string[]
  isOutOfStock?: boolean
  featured?: boolean
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  price: number
  selectedOption?: string
  color?: string
  notes?: string
}

export interface CustomerInfo {
  name: string
  phone: string
  address: string
  notes: string
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

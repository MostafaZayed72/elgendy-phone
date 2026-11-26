import type { CartItem, CustomerInfo, Product } from '~/types/store'
import { elgendyStore } from '~/data/elgendy-store'

const CART_STORAGE_KEY = 'elgendy_cart_v1'
const CUSTOMER_STORAGE_KEY = 'elgendy_customer_v1'

export function useCart() {
  const items = useState<CartItem[]>('elgendy_cart_items', () => [])
  const isOpen = useState<boolean>('elgendy_cart_open', () => false)
  const customer = useState<CustomerInfo>('elgendy_customer_info', () => ({
    name: '',
    phone: '',
    address: '',
    notes: ''
  }))
  const isHydrated = useState<boolean>('elgendy_cart_hydrated', () => false)

  const loadFromStorage = () => {
    if (!import.meta.client || isHydrated.value) return
    try {
      const rawCart = localStorage.getItem(CART_STORAGE_KEY)
      if (rawCart) {
        const parsed = JSON.parse(rawCart)
        if (Array.isArray(parsed)) items.value = parsed
      }
      const rawCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY)
      if (rawCustomer) {
        const parsedCustomer = JSON.parse(rawCustomer)
        customer.value = {
          name: parsedCustomer?.name || '',
          phone: parsedCustomer?.phone || '',
          address: parsedCustomer?.address || '',
          notes: parsedCustomer?.notes || ''
        }
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err)
    } finally {
      isHydrated.value = true
    }
  }

  const saveCart = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value))
    } catch (err) {
      console.error('Failed to save cart:', err)
    }
  }

  const saveCustomer = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer.value))
    } catch (err) {
      console.error('Failed to save customer info:', err)
    }
  }

  const openCart = () => {
    loadFromStorage()
    isOpen.value = true
    if (import.meta.client) {
      document.body.style.overflow = 'hidden'
    }
  }

  const closeCart = () => {
    isOpen.value = false
    if (import.meta.client) {
      document.body.style.overflow = ''
    }
  }

  const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedOption?: string,
    color?: string,
    notes?: string,
    selectedImage?: string,
    selectedRam?: string
  ) => {
    if (product.isOutOfStock) return false
    loadFromStorage()

    const cleanOption = selectedOption?.trim() || ''
    const cleanRam = selectedRam?.trim() || ''
    const cleanColor = color?.trim() || ''
    const keyParts = [product.id]
    if (cleanColor) keyParts.push(`col-${cleanColor}`)
    if (cleanRam) keyParts.push(`ram-${cleanRam}`)
    if (cleanOption) keyParts.push(`opt-${cleanOption}`)
    const itemId = keyParts.join('_')

    const existing = items.value.find(i => i.id === itemId)
    if (existing) {
      existing.quantity += quantity
      if (notes?.trim()) existing.notes = notes.trim()
      if (selectedImage) existing.selectedImage = selectedImage
    } else {
      items.value.push({
        id: itemId,
        product,
        quantity,
        price: product.price,
        selectedOption: cleanOption || undefined,
        selectedRam: cleanRam || undefined,
        color: cleanColor || undefined,
        notes: notes?.trim() || undefined,
        selectedImage: selectedImage || undefined
      })
    }

    saveCart()
    return true
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    const target = items.value.find(i => i.id === itemId)
    if (target) {
      target.quantity = quantity
      saveCart()
    }
  }

  const removeFromCart = (itemId: string) => {
    items.value = items.value.filter(i => i.id !== itemId)
    saveCart()
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  const buildWhatsAppOrderUrl = (lang: 'ar' | 'en') => {
    const isAr = lang === 'ar'
    const lines: string[] = []

    lines.push(isAr ? `🛍️ *طلب جديد — متجر الجندي للموبايلات*` : `🛍️ *New Order — EL-GENDY Mobile Store*`)
    lines.push('━━━━━━━━━━━━━━')

    items.value.forEach((item, index) => {
      const name = isAr ? item.product.name.ar : item.product.name.en
      lines.push(`${index + 1}. *${name}*`)
      const details: string[] = [
        `${isAr ? 'الكمية' : 'Qty'}: ${item.quantity}`,
        `${isAr ? 'السعر' : 'Price'}: ${(item.price * item.quantity).toLocaleString('en-US')} ${isAr ? 'ج.م' : 'EGP'}`
      ]
      if (item.color) details.push(`${isAr ? 'اللون' : 'Color'}: ${item.color}`)
      if (item.selectedRam) details.push(`${isAr ? 'الرامات' : 'RAM'}: ${item.selectedRam}`)
      if (item.selectedOption) details.push(`${isAr ? 'المساحة' : 'Storage'}: ${item.selectedOption}`)
      lines.push(`   ${details.join(' | ')}`)
      if (item.notes) lines.push(`   📝 ${item.notes}`)
    })

    lines.push('━━━━━━━━━━━━━━')
    lines.push(`💰 *${isAr ? 'الإجمالي التقديري' : 'Estimated Total'}:* ${totalPrice.value.toLocaleString('en-US')} ${isAr ? 'ج.م' : 'EGP'}`)

    if (customer.value.name || customer.value.phone || customer.value.address || customer.value.notes) {
      lines.push('')
      lines.push(isAr ? '👤 *بيانات العميل:*' : '👤 *Customer Details:*')
      if (customer.value.name) lines.push(`• ${isAr ? 'الاسم' : 'Name'}: ${customer.value.name}`)
      if (customer.value.phone) lines.push(`• ${isAr ? 'الهاتف' : 'Phone'}: ${customer.value.phone}`)
      if (customer.value.address) lines.push(`• ${isAr ? 'العنوان' : 'Address'}: ${customer.value.address}`)
      if (customer.value.notes) lines.push(`• ${isAr ? 'ملاحظات' : 'Notes'}: ${customer.value.notes}`)
    }

    const encoded = encodeURIComponent(lines.join('\n'))
    return `https://wa.me/${elgendyStore.whatsappNumber}?text=${encoded}`
  }

  return {
    items,
    isOpen,
    customer,
    totalCount,
    totalPrice,
    loadFromStorage,
    saveCustomer,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    buildWhatsAppOrderUrl
  }
}

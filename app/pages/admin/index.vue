<script setup lang="ts">
import {
  Plus, Trash2, Edit3, Upload, LogOut, ExternalLink, Package, Layers,
  Image as ImageIcon, Database, Cloud, Eye, EyeOff, CheckCircle2, AlertTriangle,
  Loader2, Search, X, Sparkles, Sun, Moon
} from 'lucide-vue-next'
import type { Category, Product } from '~/types/store'
import { elgendyStore } from '~/data/elgendy-store'
import { compressImage } from '~/utils/imageCompressor'

definePageMeta({
  layout: false
})

const colorMode = useColorMode()
const { showToast } = useToast()

const checkingAuth = ref(true)
const activeTab = ref<'products' | 'categories'>('products')
const searchQuery = ref('')
const loadingStore = ref(false)
const seeding = ref(false)

const storeSource = ref<'supabase' | 'local'>('local')
const supabaseConnected = ref(false)
const cloudinaryConnected = ref(false)
const imageCount = ref(0)
const maxImages = ref(250)
const categories = ref<Category[]>([])
const products = ref<Product[]>([])

// Product Modal State
const showProductModal = ref(false)
const savingProduct = ref(false)
const uploadingImage = ref(false)
const editingProduct = ref<Product | null>(null)
const formProduct = reactive({
  id: '',
  nameAr: '',
  nameEn: '',
  descAr: '',
  descEn: '',
  price: 0,
  originalPrice: '' as string | number,
  categorySlug: 'smartphones',
  image: '',
  images: [] as string[],
  newImageUrl: '',
  badgeAr: '',
  badgeEn: '',
  colorsText: '',
  colorImages: {} as Record<string, string>,
  optionsText: '',
  isHidden: false,
  isOutOfStock: false
})

// Category Modal State
const showCategoryModal = ref(false)
const savingCategory = ref(false)
const uploadingCategoryImage = ref(false)
const formCategory = reactive({
  id: '',
  slug: '',
  nameAr: '',
  nameEn: '',
  icon: 'smartphone' as 'smartphone' | 'headphones' | 'zap' | 'shield',
  image: ''
})

const loadDashboard = async () => {
  loadingStore.value = true
  try {
    const res = await $fetch<any>('/api/store?includeHidden=1')
    storeSource.value = res.source
    supabaseConnected.value = res.supabaseConnected
    cloudinaryConnected.value = res.cloudinaryConnected
    imageCount.value = res.imageCount || 0
    maxImages.value = res.maxImages || 250
    categories.value = res.categories || []
    products.value = res.products || []
  } catch (err) {
    console.error(err)
  } finally {
    loadingStore.value = false
  }
}

onMounted(async () => {
  try {
    const auth = await $fetch<{ authenticated: boolean }>('/api/auth/me')
    if (!auth.authenticated) {
      await navigateTo('/admin/login')
      return
    }
    checkingAuth.value = false
    await loadDashboard()
  } catch {
    await navigateTo('/admin/login')
  }
})

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

const quotaPercent = computed(() => {
  if (!maxImages.value) return 0
  return Math.min(100, Math.round((imageCount.value / maxImages.value) * 100))
})

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter(p =>
    p.name.ar.toLowerCase().includes(q) ||
    p.name.en.toLowerCase().includes(q) ||
    p.categorySlug.toLowerCase().includes(q)
  )
})

const parsedColors = computed(() =>
  formProduct.colorsText.split(/[,،]/).map(s => s.trim()).filter(Boolean)
)

const openAddProduct = () => {
  editingProduct.value = null
  Object.assign(formProduct, {
    id: '',
    nameAr: '',
    nameEn: '',
    descAr: '',
    descEn: '',
    price: 0,
    originalPrice: '',
    categorySlug: categories.value[0]?.slug || 'smartphones',
    image: '',
    images: [],
    newImageUrl: '',
    badgeAr: '',
    badgeEn: '',
    colorsText: '',
    colorImages: {},
    optionsText: '',
    isHidden: false,
    isOutOfStock: false
  })
  showProductModal.value = true
}

const openEditProduct = (p: Product) => {
  editingProduct.value = p
  Object.assign(formProduct, {
    id: p.id,
    nameAr: p.name.ar,
    nameEn: p.name.en,
    descAr: p.description.ar,
    descEn: p.description.en,
    price: p.price,
    originalPrice: p.originalPrice || '',
    categorySlug: p.categorySlug,
    image: p.image,
    images: Array.isArray(p.images) && p.images.length > 0 ? [...p.images] : (p.image ? [p.image] : []),
    newImageUrl: '',
    badgeAr: p.badge?.ar || '',
    badgeEn: p.badge?.en || '',
    colorsText: (p.colors || []).join('، '),
    colorImages: p.colorImages ? { ...p.colorImages } : {},
    optionsText: (p.options || []).join('، '),
    isHidden: Boolean(p.isHidden),
    isOutOfStock: Boolean(p.isOutOfStock)
  })
  showProductModal.value = true
}

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  if (files.length === 0) return

  if (imageCount.value >= maxImages.value) {
    showToast(`تم الوصول للحد الأقصى (${maxImages.value} صورة)`, 'info')
    return
  }

  uploadingImage.value = true
  let uploadedCount = 0
  try {
    for (const file of files) {
      if (imageCount.value + uploadedCount >= maxImages.value) {
        showToast(`تم الوصول للحد الأقصى (${maxImages.value} صورة)`, 'info')
        break
      }
      const compressedFile = await compressImage(file)
      const fd = new FormData()
      fd.append('file', compressedFile)
      const res = await $fetch<{ success: boolean; url: string }>('/api/upload', {
        method: 'POST',
        body: fd
      })
      if (res.url) {
        if (!formProduct.images.includes(res.url)) {
          formProduct.images.push(res.url)
        }
        if (!formProduct.image) {
          formProduct.image = res.url
        }
        uploadedCount++
      }
    }
    if (uploadedCount > 0) {
      showToast(uploadedCount > 1 ? `تم رفع ${uploadedCount} صور بنجاح` : 'تم رفع الصورة بنجاح')
    }
  } catch (err: any) {
    showToast(err?.data?.statusMessage || err?.statusMessage || 'فشل رفع الصورة', 'info', 4000)
  } finally {
    uploadingImage.value = false
    input.value = ''
  }
}

const addImageByUrl = () => {
  const url = formProduct.newImageUrl.trim()
  if (!url) return
  if (!formProduct.images.includes(url)) {
    formProduct.images.push(url)
  }
  if (!formProduct.image) {
    formProduct.image = url
  }
  formProduct.newImageUrl = ''
}

const setMainImage = (url: string) => {
  formProduct.image = url
}

const removeGalleryImage = (url: string) => {
  formProduct.images = formProduct.images.filter(i => i !== url)
  if (formProduct.image === url) {
    formProduct.image = formProduct.images[0] || ''
  }
}

const saveProduct = async () => {
  if (!formProduct.nameAr.trim()) {
    showToast('يرجى إدخال اسم المنتج بالعربية', 'info')
    return
  }
  savingProduct.value = true
  try {
    const splitList = (txt: string) =>
      txt.split(/[,،]/).map(s => s.trim()).filter(Boolean)

    const cleanColorImages: Record<string, string> = {}
    const activeColors = splitList(formProduct.colorsText)
    for (const col of activeColors) {
      if (formProduct.colorImages[col]) {
        cleanColorImages[col] = formProduct.colorImages[col]
      }
    }

    const payload: Product = {
      id: formProduct.id || `prod-${Date.now()}`,
      categorySlug: formProduct.categorySlug,
      name: {
        ar: formProduct.nameAr.trim(),
        en: formProduct.nameEn.trim() || formProduct.nameAr.trim()
      },
      description: {
        ar: formProduct.descAr.trim(),
        en: formProduct.descEn.trim() || formProduct.descAr.trim()
      },
      price: Number(formProduct.price) || 0,
      originalPrice: formProduct.originalPrice ? Number(formProduct.originalPrice) : undefined,
      unit: { ar: 'جهاز', en: 'device' },
      image: formProduct.image.trim() || formProduct.images[0] || '/images/products/iphone-13.jpg',
      images: formProduct.images.length > 0 ? formProduct.images : (formProduct.image.trim() ? [formProduct.image.trim()] : []),
      badge: formProduct.badgeAr.trim()
        ? { ar: formProduct.badgeAr.trim(), en: formProduct.badgeEn.trim() || formProduct.badgeAr.trim() }
        : undefined,
      colors: activeColors,
      colorImages: cleanColorImages,
      options: splitList(formProduct.optionsText),
      isHidden: formProduct.isHidden,
      isOutOfStock: formProduct.isOutOfStock
    }

    await $fetch('/api/products', {
      method: 'POST',
      body: { product: payload }
    })
    showToast('تم حفظ المنتج في قاعدة البيانات')
    showProductModal.value = false
    await loadDashboard()
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'حدث خطأ أثناء الحفظ', 'info', 4000)
  } finally {
    savingProduct.value = false
  }
}

const toggleProductFlag = async (p: Product, field: 'isHidden' | 'isOutOfStock') => {
  try {
    const updated = { ...p, [field]: !p[field] }
    await $fetch('/api/products', {
      method: 'POST',
      body: { product: updated }
    })
    await loadDashboard()
    showToast('تم تحديث حالة المنتج')
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'تعذر التحديث — تأكد من ربط Supabase', 'info')
  }
}

const deleteProduct = async (p: Product) => {
  if (!confirm(`هل أنت متأكد من حذف "${p.name.ar}"؟`)) return
  try {
    await $fetch('/api/products', {
      method: 'DELETE',
      body: { id: p.id }
    })
    showToast('تم حذف المنتج')
    await loadDashboard()
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'تعذر الحذف', 'info')
  }
}

const openAddCategory = () => {
  Object.assign(formCategory, {
    id: '',
    slug: '',
    nameAr: '',
    nameEn: '',
    icon: 'smartphone',
    image: ''
  })
  showCategoryModal.value = true
}

const openEditCategory = (c: Category) => {
  Object.assign(formCategory, {
    id: c.id,
    slug: c.slug,
    nameAr: c.name.ar,
    nameEn: c.name.en,
    icon: c.icon,
    image: c.image || ''
  })
  showCategoryModal.value = true
}

const handleCategoryImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingCategoryImage.value = true
  try {
    const compressedFile = await compressImage(file)
    const fd = new FormData()
    fd.append('file', compressedFile)
    const res = await $fetch<{ success: boolean; url: string }>('/api/upload', {
      method: 'POST',
      body: fd
    })
    if (res.url) {
      formCategory.image = res.url
      showToast('تم رفع لوجو القسم بنجاح')
    }
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'فشل رفع الصورة', 'info', 4000)
  } finally {
    uploadingCategoryImage.value = false
    input.value = ''
  }
}

const saveCategory = async () => {
  if (!formCategory.nameAr.trim()) return
  savingCategory.value = true
  try {
    await $fetch('/api/categories', {
      method: 'POST',
      body: {
        category: {
          id: formCategory.id || `cat-${Date.now()}`,
          slug: formCategory.slug || `cat-${Date.now()}`,
          name: {
            ar: formCategory.nameAr.trim(),
            en: formCategory.nameEn.trim() || formCategory.nameAr.trim()
          },
          icon: formCategory.icon,
          image: formCategory.image.trim() || undefined
        }
      }
    })
    showToast('تم حفظ القسم بنجاح')
    showCategoryModal.value = false
    await loadDashboard()
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'تعذر حفظ القسم', 'info')
  } finally {
    savingCategory.value = false
  }
}

const deleteCategory = async (c: Category) => {
  if (!confirm(`هل تريد حذف قسم "${c.name.ar}"؟`)) return
  try {
    await $fetch('/api/categories', {
      method: 'DELETE',
      body: { id: c.id }
    })
    showToast('تم حذف القسم')
    await loadDashboard()
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'تعذر حذف القسم', 'info')
  }
}

const seedDatabase = async () => {
  seeding.value = true
  try {
    const res = await $fetch<{ productsCount: number; categoriesCount: number }>('/api/seed', {
      method: 'POST'
    })
    showToast(`تم استيراد ${res.productsCount} منتج و ${res.categoriesCount} أقسام بنجاح`)
    await loadDashboard()
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'تأكد من تشغيل schema.sql وتعبئة .env', 'info', 4000)
  } finally {
    seeding.value = false
  }
}
</script>

<template>
  <div dir="rtl" class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <!-- Loading Screen -->
    <div v-if="checkingAuth" class="min-h-screen flex items-center justify-center">
      <Loader2 class="w-8 h-8 animate-spin text-brand-500" />
    </div>

    <template v-else>
      <!-- Top Bar -->
      <header class="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <img
              :src="colorMode.value === 'dark' ? elgendyStore.logoDark : elgendyStore.logo"
              alt="EL-GENDY"
              class="h-10 object-contain"
            />
            <div class="hidden sm:block">
              <h1 class="font-black text-base">لوحة تحكم متجر الجندي</h1>
              <p class="text-[11px] text-slate-500">إدارة المنتجات والأقسام ورفع الصور</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <NuxtLink
              to="/"
              target="_blank"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold"
            >
              <ExternalLink class="w-3.5 h-3.5 text-brand-500" />
              <span>معاينة المتجر</span>
            </NuxtLink>

            <button
              type="button"
              @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
              class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer"
            >
              <Sun v-if="colorMode.value === 'dark'" class="w-4 h-4 text-amber-400" />
              <Moon v-else class="w-4 h-4" />
            </button>

            <button
              type="button"
              @click="logout"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold cursor-pointer"
            >
              <LogOut class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main class="w-full px-4 sm:px-8 py-6 space-y-6">
        <!-- Quota & Stats Banner -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Products Stat -->
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
              <Package class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs text-slate-500 font-bold">إجمالي المنتجات</p>
              <p class="text-2xl font-black">{{ products.length }}</p>
            </div>
          </div>

          <!-- Categories Stat -->
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <Layers class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs text-slate-500 font-bold">الأقسام</p>
              <p class="text-2xl font-black">{{ categories.length }}</p>
            </div>
          </div>

          <!-- 250 Image Quota Bar -->
          <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <ImageIcon class="w-4 h-4 text-amber-500" />
                <span>رصيد الصور (الحد الأقصى 250)</span>
              </span>
              <span class="font-black" :class="imageCount >= maxImages ? 'text-rose-500' : 'text-brand-500'">
                {{ imageCount }} / {{ maxImages }}
              </span>
            </div>
            <div class="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="imageCount >= maxImages ? 'bg-rose-500' : 'bg-brand-500'"
                :style="{ width: `${quotaPercent}%` }"
              />
            </div>
          </div>
        </div>

        <!-- Seed Alert if Supabase connected but still showing local fallback -->
        <div
          v-if="supabaseConnected && storeSource === 'local'"
          class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div class="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300">
            <AlertTriangle class="w-5 h-5 shrink-0" />
            <span>اضغط لاستيراد باقي المنتجات الافتراضية إلى قاعدة البيانات (دون المساس بتعديلاتك الحالية).</span>
          </div>
          <button
            type="button"
            :disabled="seeding"
            @click="seedDatabase"
            class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Loader2 v-if="seeding" class="w-4 h-4 animate-spin" />
            <Sparkles v-else class="w-4 h-4" />
            <span>استيراد المنتجات الافتراضية</span>
          </button>
        </div>

        <!-- Tabs & Actions -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="activeTab = 'products'"
              class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer"
              :class="activeTab === 'products' ? 'bg-brand-500 text-white shadow' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'"
            >
              المنتجات ({{ products.length }})
            </button>
            <button
              type="button"
              @click="activeTab = 'categories'"
              class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer"
              :class="activeTab === 'categories' ? 'bg-brand-500 text-white shadow' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'"
            >
              الأقسام ({{ categories.length }})
            </button>
          </div>

          <div class="flex items-center gap-2">
            <div v-if="activeTab === 'products'" class="relative flex-1 sm:w-64">
              <Search class="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                v-model="searchQuery"
                type="search"
                placeholder="بحث في المنتجات..."
                class="w-full ps-9 pe-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              v-if="activeTab === 'products'"
              type="button"
              @click="openAddProduct"
              class="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus class="w-4 h-4" />
              <span>إضافة منتج</span>
            </button>

            <button
              v-else
              type="button"
              @click="openAddCategory"
              class="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus class="w-4 h-4" />
              <span>إضافة قسم</span>
            </button>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-if="activeTab === 'products'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="p in filteredProducts"
            :key="p.id"
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 flex flex-col gap-3"
          >
            <div class="flex gap-3">
              <img :src="p.image" :alt="p.name.ar" class="w-20 h-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0" />
              <div class="flex-1 min-w-0 space-y-1">
                <h3 class="font-extrabold text-sm line-clamp-2">{{ p.name.ar }}</h3>
                <p class="text-xs font-black text-brand-500">{{ p.price.toLocaleString('en-US') }} ج.م</p>
                <div class="flex flex-wrap gap-1">
                  <span v-if="p.isHidden" class="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">مخفي</span>
                  <span v-if="p.isOutOfStock" class="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-500 text-[10px] font-bold">نفذ</span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                @click="toggleProductFlag(p, 'isHidden')"
                class="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                :title="p.isHidden ? 'إظهار' : 'إخفاء'"
              >
                <EyeOff v-if="p.isHidden" class="w-3.5 h-3.5" />
                <Eye v-else class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                @click="toggleProductFlag(p, 'isOutOfStock')"
                class="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold cursor-pointer"
              >
                {{ p.isOutOfStock ? 'متوفر' : 'نفذ' }}
              </button>
              <button
                type="button"
                @click="openEditProduct(p)"
                class="flex-1 py-1.5 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Edit3 class="w-3.5 h-3.5" />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                @click="deleteProduct(p)"
                class="px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-bold cursor-pointer"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Categories List -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <img
                v-if="cat.image"
                :src="cat.image"
                :alt="cat.name.ar"
                class="w-11 h-11 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
              />
              <div class="min-w-0">
                <h3 class="font-extrabold text-sm truncate">{{ cat.name.ar }}</h3>
                <p class="text-xs text-slate-400 truncate">{{ cat.name.en }} ({{ cat.slug }})</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <button type="button" @click="openEditCategory(cat)" class="p-2 rounded-xl bg-brand-500/10 text-brand-500 cursor-pointer">
                <Edit3 class="w-4 h-4" />
              </button>
              <button type="button" @click="deleteCategory(cat)" class="p-2 rounded-xl bg-rose-500/10 text-rose-500 cursor-pointer">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- Add / Edit Product Modal -->
      <Teleport to="body">
        <div v-if="showProductModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6" @click.self="showProductModal = false">
          <div class="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="font-black text-lg">{{ editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد' }}</h2>
              <button type="button" @click="showProductModal = false" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer">
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Multi-Image Gallery Upload Box -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <label class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold cursor-pointer">
                  <Loader2 v-if="uploadingImage" class="w-4 h-4 animate-spin" />
                  <Upload v-else class="w-4 h-4" />
                  <span>{{ uploadingImage ? 'جاري رفع الصور...' : 'رفع صور من جهازك (يمكنك اختيار أكثر من صورة)' }}</span>
                  <input type="file" accept="image/*" multiple class="hidden" @change="handleImageUpload" :disabled="uploadingImage" />
                </label>
                <span class="text-[11px] font-bold text-slate-500">
                  {{ formProduct.images.length }} صور مضافة
                </span>
              </div>

              <!-- Gallery Thumbnails -->
              <div v-if="formProduct.images.length > 0" class="flex flex-wrap gap-2.5">
                <div
                  v-for="(imgUrl, idx) in formProduct.images"
                  :key="`${imgUrl}-${idx}`"
                  class="relative group w-20 h-20 rounded-xl overflow-hidden border-2 bg-white dark:bg-slate-900"
                  :class="formProduct.image === imgUrl ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-slate-200 dark:border-slate-700'"
                >
                  <img :src="imgUrl" class="w-full h-full object-cover cursor-pointer" @click="setMainImage(imgUrl)" />
                  <span
                    v-if="formProduct.image === imgUrl"
                    class="absolute bottom-1 inset-x-1 text-center py-0.5 rounded bg-brand-500 text-white text-[9px] font-black pointer-events-none"
                  >
                    رئيسية
                  </span>
                  <button
                    type="button"
                    @click="removeGalleryImage(imgUrl)"
                    class="absolute top-1 end-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow cursor-pointer opacity-90 hover:opacity-100"
                    title="حذف الصورة"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>

              <!-- Add by URL -->
              <div class="flex gap-2">
                <input
                  v-model="formProduct.newImageUrl"
                  type="text"
                  placeholder="أو الصق رابط صورة إضافية هنا"
                  class="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  @keyup.enter.prevent="addImageByUrl"
                />
                <button
                  type="button"
                  @click="addImageByUrl"
                  class="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                >
                  إضافة
                </button>
              </div>
            </div>

            <!-- Link Each Color to its Image -->
            <div v-if="parsedColors.length > 0 && formProduct.images.length > 0" class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-slate-700 dark:text-slate-200">ربط كل لون بصورته (اختياري)</span>
                <span class="text-[11px] text-slate-400">اضغط على الصورة المناسبة لكل لون</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="col in parsedColors"
                  :key="`link-${col}`"
                  class="flex items-center justify-between gap-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70"
                >
                  <span class="text-xs font-extrabold text-slate-800 dark:text-slate-100 shrink-0 min-w-[70px]">{{ col }}</span>
                  <div class="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    <button
                      v-for="(imgUrl, iIdx) in formProduct.images"
                      :key="`col-img-${col}-${iIdx}`"
                      type="button"
                      @click="formProduct.colorImages[col] = formProduct.colorImages[col] === imgUrl ? '' : imgUrl"
                      class="w-10 h-10 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all"
                      :class="formProduct.colorImages[col] === imgUrl
                        ? 'border-brand-500 ring-2 ring-brand-500/30 scale-105'
                        : 'border-slate-200 dark:border-slate-700 opacity-65 hover:opacity-100'"
                    >
                      <img :src="imgUrl" class="w-full h-full object-cover" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold block mb-1">اسم المنتج (عربي) *</label>
                <input v-model="formProduct.nameAr" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">اسم المنتج (إنجليزي)</label>
                <input v-model="formProduct.nameEn" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">السعر (ج.م) *</label>
                <input v-model.number="formProduct.price" type="number" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">السعر قبل الخصم (اختياري)</label>
                <input v-model="formProduct.originalPrice" type="number" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">القسم</label>
                <select v-model="formProduct.categorySlug" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                  <option v-for="c in categories" :key="c.id" :value="c.slug">{{ c.name.ar }}</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">شارة العرض (مثال: الأكثر طلباً)</label>
                <input v-model="formProduct.badgeAr" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">الألوان (افصل بينها بفاصلة)</label>
                <input v-model="formProduct.colorsText" type="text" placeholder="أسود، أبيض، أزرق" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">المساحات / الخيارات (افصل بفاصلة)</label>
                <input v-model="formProduct.optionsText" type="text" placeholder="128GB, 256GB, 512GB" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm" />
              </div>
            </div>

            <!-- Link Each Color to its Image -->
            <div v-if="parsedColors.length > 0 && formProduct.images.length > 0" class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-extrabold text-slate-700 dark:text-slate-200">ربط كل لون بصورته (اختياري)</span>
                <span class="text-[11px] text-slate-400">اضغط على الصورة المناسبة لكل لون</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="col in parsedColors"
                  :key="`link-${col}`"
                  class="flex items-center justify-between gap-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70"
                >
                  <span class="text-xs font-extrabold text-slate-800 dark:text-slate-100 shrink-0 min-w-[70px]">{{ col }}</span>
                  <div class="flex items-center gap-1.5 overflow-x-auto py-0.5">
                    <button
                      v-for="(imgUrl, iIdx) in formProduct.images"
                      :key="`col-img-${col}-${iIdx}`"
                      type="button"
                      @click="formProduct.colorImages[col] = formProduct.colorImages[col] === imgUrl ? '' : imgUrl"
                      class="w-10 h-10 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all"
                      :class="formProduct.colorImages[col] === imgUrl
                        ? 'border-brand-500 ring-2 ring-brand-500/30 scale-105'
                        : 'border-slate-200 dark:border-slate-700 opacity-65 hover:opacity-100'"
                    >
                      <img :src="imgUrl" class="w-full h-full object-cover" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold block mb-1">الوصف (عربي)</label>
                <textarea v-model="formProduct.descAr" rows="3" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"></textarea>
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">الوصف (إنجليزي)</label>
                <textarea v-model="formProduct.descEn" rows="3" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"></textarea>
              </div>
            </div>

            <div class="flex items-center gap-6 text-xs font-bold">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="formProduct.isHidden" type="checkbox" class="rounded" />
                <span>إخفاء المنتج مؤقتاً</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="formProduct.isOutOfStock" type="checkbox" class="rounded" />
                <span>نفذت الكمية</span>
              </label>
            </div>

            <button
              type="button"
              :disabled="savingProduct"
              @click="saveProduct"
              class="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Loader2 v-if="savingProduct" class="w-4 h-4 animate-spin" />
              <CheckCircle2 v-else class="w-4 h-4" />
              <span>حفظ المنتج</span>
            </button>
          </div>
        </div>
      </Teleport>

      <!-- Add / Edit Category Modal -->
      <Teleport to="body">
        <div v-if="showCategoryModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showCategoryModal = false">
          <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="font-black text-lg">بيانات القسم</h2>
              <button type="button" @click="showCategoryModal = false" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer">
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="space-y-3">
              <!-- Category Logo Upload -->
              <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 flex items-center gap-3">
                <img
                  v-if="formCategory.image"
                  :src="formCategory.image"
                  class="w-14 h-14 rounded-xl object-cover bg-white shrink-0"
                />
                <div class="flex-1 space-y-2 min-w-0">
                  <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold cursor-pointer">
                    <Loader2 v-if="uploadingCategoryImage" class="w-3.5 h-3.5 animate-spin" />
                    <Upload v-else class="w-3.5 h-3.5" />
                    <span>{{ uploadingCategoryImage ? 'جاري الرفع...' : 'رفع لوجو للقسم' }}</span>
                    <input type="file" accept="image/*" class="hidden" @change="handleCategoryImageUpload" :disabled="uploadingCategoryImage" />
                  </label>
                  <input
                    v-model="formCategory.image"
                    type="text"
                    placeholder="أو الصق رابط صورة اللوجو هنا"
                    class="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div>
                <label class="text-xs font-bold block mb-1">اسم القسم (عربي) *</label>
                <input v-model="formCategory.nameAr" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">اسم القسم (إنجليزي)</label>
                <input v-model="formCategory.nameEn" type="text" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">المعرف بالإنجليزية</label>
                <input v-model="formCategory.slug" type="text" placeholder="smartphones" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" />
              </div>
              <div>
                <label class="text-xs font-bold block mb-1">الأيقونة</label>
                <select v-model="formCategory.icon" class="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                  <option value="smartphone">هاتف</option>
                  <option value="headphones">سماعات</option>
                  <option value="zap">شواحن</option>
                  <option value="shield">حماية</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              :disabled="savingCategory"
              @click="saveCategory"
              class="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Loader2 v-if="savingCategory" class="w-4 h-4 animate-spin" />
              <span>حفظ القسم</span>
            </button>
          </div>
        </div>
      </Teleport>

      <ToastContainer />
    </template>
  </div>
</template>

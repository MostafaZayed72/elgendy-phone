<script setup lang="ts">
import {
  ArrowRight, ArrowLeft, ShoppingBag, Plus, Minus, Check,
  Share2, ZoomIn, X, ChevronLeft, ChevronRight, Truck, Sparkles
} from 'lucide-vue-next'
import type { Category, Product } from '~/types/store'
import { elgendyStore } from '~/data/elgendy-store'

const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'ar'))
const isAr = computed(() => lang.value === 'ar')

const { addToCart } = useCart()
const { showToast } = useToast()

const productId = computed(() => String(route.params.id || ''))

const { data, pending } = await useFetch<{
  product: Product
  category: Category | null
  relatedProducts: Product[]
}>(() => `/api/products/${productId.value}`)

const product = computed(() => data.value?.product || null)
const category = computed(() => data.value?.category || null)
const relatedProducts = computed(() => data.value?.relatedProducts || [])

const galleryImages = computed<string[]>(() => {
  if (!product.value) return []
  const list = new Set<string>()
  if (product.value.image) list.add(product.value.image)
  if (Array.isArray(product.value.images)) {
    product.value.images.forEach((img) => {
      if (img) list.add(img)
    })
  }
  return Array.from(list)
})

const activeImageIndex = ref(0)
const isZoomOpen = ref(false)
const selectedColor = ref('')
const selectedOption = ref('')
const quantity = ref(1)
const notes = ref('')

watch(product, (p) => {
  if (p) {
    activeImageIndex.value = 0
    selectedColor.value = p.colors?.[0] || ''
    selectedOption.value = p.options?.[0] || ''
    quantity.value = 1
    notes.value = ''
  }
}, { immediate: true })

const activeImage = computed(() => {
  return galleryImages.value[activeImageIndex.value] || product.value?.image || ''
})

const discountPercent = computed(() => {
  if (!product.value?.originalPrice || product.value.originalPrice <= product.value.price) return 0
  return Math.round(((product.value.originalPrice - product.value.price) / product.value.originalPrice) * 100)
})

const savingsAmount = computed(() => {
  if (!product.value?.originalPrice || product.value.originalPrice <= product.value.price) return 0
  return product.value.originalPrice - product.value.price
})

useSeoMeta({
  title: () => product.value ? `${product.value.name[lang.value]} | ${elgendyStore.name[lang.value]}` : t('store.catalogTitle'),
  description: () => product.value?.description[lang.value] || t('store.tagline'),
  ogImage: () => product.value?.image || '/images/og-share.jpg'
})

const handleAddToCart = () => {
  if (!product.value) return
  const added = addToCart(
    product.value,
    quantity.value,
    selectedOption.value || undefined,
    selectedColor.value || undefined,
    notes.value || undefined
  )
  if (added) {
    showToast(t('catalog.addedToCart'))
  }
}

const directWhatsappUrl = computed(() => {
  if (!product.value) return '#'
  const lines = [
    isAr.value ? 'مرحباً متجر الجندي، أود طلب المنتج التالي:' : 'Hello EL-GENDY Store, I would like to order:',
    `*${product.value.name[lang.value]}*`,
    `${isAr.value ? 'الكمية' : 'Qty'}: ${quantity.value}`,
    `${isAr.value ? 'السعر' : 'Price'}: ${(product.value.price * quantity.value).toLocaleString('en-US')} ${t('catalog.egp')}`
  ]
  if (selectedColor.value) lines.push(`${t('catalog.color')}: ${selectedColor.value}`)
  if (selectedOption.value) lines.push(`${t('catalog.option')}: ${selectedOption.value}`)
  if (notes.value.trim()) lines.push(`${t('catalog.notes')}: ${notes.value.trim()}`)
  return `https://wa.me/${elgendyStore.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
})

const shareProduct = async () => {
  if (!import.meta.client || !product.value) return
  const shareUrl = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({
        title: product.value.name[lang.value],
        url: shareUrl
      })
      return
    } catch {
      // fallback to copy
    }
  }
  try {
    await navigator.clipboard.writeText(shareUrl)
    showToast(isAr.value ? 'تم نسخ رابط المنتج' : 'Product link copied')
  } catch {
    // ignore
  }
}

const prevImage = () => {
  if (galleryImages.value.length <= 1) return
  activeImageIndex.value = (activeImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

const nextImage = () => {
  if (galleryImages.value.length <= 1) return
  activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <StoreHeader />

    <main class="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-10 space-y-10">
      <!-- Top Navigation Bar: Back + Breadcrumbs -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <nav class="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
          <NuxtLink :to="localePath('/')" class="hover:text-brand-500 transition-colors">
            {{ isAr ? 'الرئيسية' : 'Home' }}
          </NuxtLink>
          <span>/</span>
          <span v-if="category">{{ category.name[lang] }}</span>
          <span v-if="category">/</span>
          <span v-if="product" class="text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
            {{ product.name[lang] }}
          </span>
        </nav>

        <NuxtLink
          :to="localePath('/')"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-200 shadow-xs transition-all"
        >
          <ArrowRight v-if="isAr" class="w-4 h-4" />
          <ArrowLeft v-else class="w-4 h-4" />
          <span>{{ isAr ? 'العودة لكل المنتجات' : 'Back to All Products' }}</span>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        <div class="aspect-square rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div class="space-y-4">
          <div class="h-8 w-2/3 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div class="h-12 w-1/3 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div class="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <!-- Product Content -->
      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <!-- Gallery Column -->
        <div class="lg:col-span-6 space-y-4">
          <div class="relative aspect-square rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden group">
            <img
              :src="activeImage"
              :alt="product.name[lang]"
              class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />

            <!-- Discount Badge -->
            <span
              v-if="discountPercent > 0"
              class="absolute top-4 start-4 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-black shadow-md"
            >
              {{ isAr ? `توفير ${discountPercent}%` : `Save ${discountPercent}%` }}
            </span>

            <!-- Share Button -->
            <button
              type="button"
              @click="shareProduct"
              class="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
              :title="isAr ? 'مشاركة المنتج' : 'Share product'"
            >
              <Share2 class="w-4 h-4" />
            </button>

            <!-- Zoom Button -->
            <button
              type="button"
              @click="isZoomOpen = true"
              class="absolute bottom-4 start-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/75 hover:bg-slate-950 text-white text-xs font-bold backdrop-blur-md shadow-md cursor-pointer transition-all"
            >
              <ZoomIn class="w-4 h-4" />
              <span>{{ isAr ? 'تكبير بكامل الحجم' : 'Full Size Zoom' }}</span>
            </button>

            <!-- Prev / Next Arrows -->
            <template v-if="galleryImages.length > 1">
              <button
                type="button"
                @click="prevImage"
                class="absolute top-1/2 -translate-y-1/2 start-3 w-9 h-9 rounded-full bg-white/85 dark:bg-slate-900/85 text-slate-800 dark:text-white shadow-md flex items-center justify-center cursor-pointer"
              >
                <ChevronRight v-if="isAr" class="w-5 h-5" />
                <ChevronLeft v-else class="w-5 h-5" />
              </button>
              <button
                type="button"
                @click="nextImage"
                class="absolute top-1/2 -translate-y-1/2 end-3 w-9 h-9 rounded-full bg-white/85 dark:bg-slate-900/85 text-slate-800 dark:text-white shadow-md flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft v-if="isAr" class="w-5 h-5" />
                <ChevronRight v-else class="w-5 h-5" />
              </button>
            </template>
          </div>

          <!-- Thumbnails Strip -->
          <div v-if="galleryImages.length > 0" class="space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>{{ isAr ? 'صور وزوايا المنتج' : 'Product Gallery' }}</span>
              <span>{{ galleryImages.length }} {{ isAr ? 'صور' : 'images' }}</span>
            </div>
            <div class="flex items-center gap-2.5 overflow-x-auto pb-1">
              <button
                v-for="(imgUrl, idx) in galleryImages"
                :key="`thumb-${idx}`"
                type="button"
                @click="activeImageIndex = idx"
                class="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-white dark:bg-slate-900"
                :class="activeImageIndex === idx
                  ? 'border-brand-500 ring-2 ring-brand-500/25 scale-[1.03]'
                  : 'border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100'"
              >
                <img :src="imgUrl" :alt="product.name[lang]" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </div>

        <!-- Details Column -->
        <div class="lg:col-span-6 space-y-5">
          <!-- Status & Badge Pills -->
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold"
              :class="product.isOutOfStock
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'"
            >
              <span class="w-2 h-2 rounded-full" :class="product.isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500'" />
              <span>{{ product.isOutOfStock ? t('catalog.outOfStock') : (isAr ? 'متوفر في المخزن - جاهز للشحن الفوري' : 'In Stock - Ready to Ship') }}</span>
            </span>

            <span
              v-if="product.badge"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-extrabold"
            >
              <Sparkles class="w-3.5 h-3.5" />
              <span>{{ product.badge[lang] }}</span>
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {{ product.name[lang] }}
          </h1>

          <!-- Price Card -->
          <div class="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div class="flex flex-wrap items-baseline gap-3">
              <span class="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">
                {{ product.price.toLocaleString('en-US') }}
              </span>
              <span class="text-sm font-bold text-slate-500 dark:text-slate-400">
                {{ t('catalog.egp') }} / {{ product.unit[lang] }}
              </span>
              <span
                v-if="product.originalPrice && product.originalPrice > product.price"
                class="text-base text-slate-400 line-through font-bold"
              >
                {{ product.originalPrice.toLocaleString('en-US') }} {{ t('catalog.egp') }}
              </span>
              <span
                v-if="savingsAmount > 0"
                class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold"
              >
                {{ isAr ? `وفر ${savingsAmount.toLocaleString('en-US')} ج.م` : `Save ${savingsAmount.toLocaleString('en-US')} EGP` }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Truck class="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{{ isAr ? 'هذا المنتج متاح للشحن السريع لجميع المحافظات' : 'Available for fast nationwide shipping' }}</span>
            </div>
          </div>

          <!-- Specifications Card -->
          <div class="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
            <h2 class="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-brand-500" />
              <span>{{ isAr ? 'تفاصيل ومواصفات المنتج:' : 'Product Specifications:' }}</span>
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {{ product.description[lang] }}
            </p>
          </div>

          <!-- Options -->
          <div v-if="product.options?.length" class="space-y-2">
            <label class="text-xs font-extrabold text-slate-600 dark:text-slate-300">{{ t('catalog.option') }}</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="opt in product.options"
                :key="opt"
                type="button"
                @click="selectedOption = opt"
                class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-1.5"
                :class="selectedOption === opt
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'"
              >
                <Check v-if="selectedOption === opt" class="w-3.5 h-3.5" />
                <span>{{ opt }}</span>
              </button>
            </div>
          </div>

          <!-- Colors -->
          <div v-if="product.colors?.length" class="space-y-2">
            <label class="text-xs font-extrabold text-slate-600 dark:text-slate-300">{{ t('catalog.color') }}</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="col in product.colors"
                :key="col"
                type="button"
                @click="selectedColor = col"
                class="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer"
                :class="selectedColor === col
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'"
              >
                {{ col }}
              </button>
            </div>
          </div>

          <!-- Quantity + Notes + CTA -->
          <div class="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">{{ t('catalog.quantity') }}</label>
                <div class="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2">
                  <button type="button" @click="quantity = Math.max(1, quantity - 1)" class="p-1 cursor-pointer">
                    <Minus class="w-4 h-4" />
                  </button>
                  <span class="font-black text-base">{{ quantity }}</span>
                  <button type="button" @click="quantity++" class="p-1 cursor-pointer">
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="sm:col-span-2">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">{{ t('catalog.notes') }}</label>
                <input
                  v-model="notes"
                  type="text"
                  :placeholder="t('catalog.notesPlaceholder')"
                  class="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                :disabled="product.isOutOfStock"
                @click="handleAddToCart"
                class="flex-1 py-3.5 px-5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag class="w-5 h-5" />
                <span>{{ product.isOutOfStock ? t('catalog.outOfStock') : `${t('catalog.addToCart')} (${quantity})` }}</span>
              </button>

              <a
                :href="directWhatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <WhatsAppIcon class="w-5 h-5" />
                <span>{{ t('catalog.orderNowWhatsapp') }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section v-if="relatedProducts.length > 0" class="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-5">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {{ isAr ? 'منتجات مشابهة قد تعجبك' : 'Related Products' }}
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
          <ProductCard
            v-for="(rel, idx) in relatedProducts"
            :key="rel.id"
            :product="rel"
            :index="idx"
          />
        </div>
      </section>
    </main>

    <StoreFooter />

    <!-- Full-Size Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="isZoomOpen"
        class="fixed inset-0 z-[80] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        @click.self="isZoomOpen = false"
      >
        <button
          type="button"
          @click="isZoomOpen = false"
          class="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
        <img
          :src="activeImage"
          :alt="product?.name[lang]"
          class="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
        />
      </div>
    </Teleport>
  </div>
</template>

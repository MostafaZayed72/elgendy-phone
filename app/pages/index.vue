<script setup lang="ts">
import { Search, Smartphone, Headphones, Zap, Shield, PackageX, LayoutGrid } from 'lucide-vue-next'
import { storeCategories, storeProducts } from '~/data/elgendy-store'
import type { Product } from '~/types/store'

const { locale, t } = useI18n()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'ar'))

const { data: storeData } = await useFetch('/api/store', {
  default: () => ({
    source: 'local',
    categories: storeCategories,
    products: storeProducts
  })
})

const categories = computed(() => storeData.value?.categories || storeCategories)
const products = computed(() => storeData.value?.products || storeProducts)

const activeCategory = ref<string>('all')
const searchQuery = ref<string>('')
const selectedProduct = ref<Product | null>(null)
const isFilterSheetOpen = ref(false)

// Draggable floating filter button state
const filterBtnRef = ref<HTMLElement | null>(null)
const filterBtnPos = ref<{ x: number; y: number } | null>(null)
const isDraggingFilter = ref(false)
let dragStartX = 0
let dragStartY = 0
let originLeft = 0
let originTop = 0
let hasDragged = false

const clampFilterPos = (x: number, y: number) => {
  if (!import.meta.client) return { x, y }
  const w = filterBtnRef.value?.offsetWidth || 56
  const h = filterBtnRef.value?.offsetHeight || 56
  return {
    x: Math.max(8, Math.min(window.innerWidth - w - 8, x)),
    y: Math.max(8, Math.min(window.innerHeight - h - 8, y))
  }
}

const onFilterPointerDown = (e: PointerEvent) => {
  if (!import.meta.client || !filterBtnRef.value) return
  const rect = filterBtnRef.value.getBoundingClientRect()
  dragStartX = e.clientX
  dragStartY = e.clientY
  originLeft = rect.left
  originTop = rect.top
  hasDragged = false
  isDraggingFilter.value = true
  ;(e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId)
}

const onFilterPointerMove = (e: PointerEvent) => {
  if (!isDraggingFilter.value) return
  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  if (!hasDragged && Math.hypot(dx, dy) > 6) {
    hasDragged = true
  }
  if (hasDragged) {
    filterBtnPos.value = clampFilterPos(originLeft + dx, originTop + dy)
  }
}

const onFilterPointerUp = (e: PointerEvent) => {
  if (!isDraggingFilter.value) return
  isDraggingFilter.value = false
  try {
    ;(e.currentTarget as HTMLElement)?.releasePointerCapture?.(e.pointerId)
  } catch {
    // ignore
  }
  if (hasDragged && filterBtnPos.value) {
    try {
      localStorage.setItem('elgendy_filter_btn_pos', JSON.stringify(filterBtnPos.value))
    } catch {
      // ignore
    }
  } else {
    isFilterSheetOpen.value = true
  }
}

const handleFilterResize = () => {
  if (filterBtnPos.value) {
    filterBtnPos.value = clampFilterPos(filterBtnPos.value.x, filterBtnPos.value.y)
  }
}

onMounted(() => {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem('elgendy_filter_btn_pos')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
          filterBtnPos.value = clampFilterPos(parsed.x, parsed.y)
        }
      }
    } catch {
      // ignore
    }
    window.addEventListener('resize', handleFilterResize, { passive: true })
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', handleFilterResize)
  }
})

const selectCategoryAndScroll = (slug: string) => {
  activeCategory.value = slug
  isFilterSheetOpen.value = false
  if (import.meta.client) {
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })
  }
}

const latestProducts = computed(() => products.value.slice(0, 10))

useSeoMeta({
  title: () => t('store.catalogTitle'),
  description: () => t('store.tagline'),
  ogTitle: () => t('store.catalogTitle'),
  ogDescription: () => t('store.tagline'),
  ogImage: '/images/og-share.jpg',
  twitterCard: 'summary_large_image'
})

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return products.value.filter((product) => {
    const matchesCategory = activeCategory.value === 'all' || product.categorySlug === activeCategory.value
    if (!matchesCategory) return false
    if (!q) return true
    const inName = product.name.ar.toLowerCase().includes(q) || product.name.en.toLowerCase().includes(q)
    const inDesc = product.description.ar.toLowerCase().includes(q) || product.description.en.toLowerCase().includes(q)
    return inName || inDesc
  })
})

const resetFilters = () => {
  activeCategory.value = 'all'
  searchQuery.value = ''
}

const getCategoryIcon = (icon: string) => {
  if (icon === 'smartphone') return Smartphone
  if (icon === 'headphones') return Headphones
  if (icon === 'zap') return Zap
  return Shield
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <StoreHeader />
    <StoreHero :carousel-products="latestProducts" :settings="storeData?.settings" @select="selectedProduct = $event" />

    <!-- Static Promo Banner Below Hero -->
    <section
      v-if="storeData?.settings?.promoBannerEnabled && storeData?.settings?.promoBannerImage"
      class="w-full px-4 sm:px-6 lg:px-10 pt-5"
      data-aos="fade-up"
    >
      <a
        v-if="storeData.settings.promoBannerLink"
        :href="storeData.settings.promoBannerLink"
        target="_blank"
        rel="noopener noreferrer"
        class="block overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-shadow"
      >
        <img
          :src="storeData.settings.promoBannerImage"
          :alt="t('store.name')"
          class="w-full max-h-[240px] sm:max-h-[360px] md:max-h-[420px] object-cover object-center"
        />
      </a>
      <div
        v-else
        class="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md"
      >
        <img
          :src="storeData.settings.promoBannerImage"
          :alt="t('store.name')"
          class="w-full max-h-[240px] sm:max-h-[360px] md:max-h-[420px] object-cover object-center"
        />
      </div>
    </section>

    <LatestProductsMarquee :products="latestProducts" @select="selectedProduct = $event" />

    <!-- Main Catalog Section -->
    <main id="catalog-section" class="flex-1 w-full px-4 sm:px-6 lg:px-10 py-10 sm:py-14 space-y-8">
      <!-- Section Header + Search -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4" data-aos="fade-up">
        <div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {{ t('catalog.title') }}
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {{ filteredProducts.length }} {{ t('catalog.resultsCount') }}
          </p>
        </div>

        <!-- Search Input -->
        <div class="relative w-full md:w-80">
          <Search class="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="search"
            :placeholder="t('nav.searchPlaceholder')"
            class="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs transition-all"
          />
        </div>
      </div>

      <!-- Category 3D Cards Strip -->
      <div class="flex items-stretch gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar" data-aos="fade-up" data-aos-delay="80">
        <button
          type="button"
          @click="activeCategory = 'all'"
          class="group shrink-0 min-w-[96px] sm:min-w-[116px] flex flex-col items-center justify-center gap-2 p-2.5 sm:p-3 rounded-3xl border transition-all duration-300 cursor-pointer"
          :class="activeCategory === 'all'
            ? 'bg-gradient-to-b from-brand-500 to-brand-600 text-white border-brand-500 shadow-lg shadow-brand-500/30 -translate-y-0.5'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 hover:-translate-y-0.5 shadow-sm'"
        >
          <div
            class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 shadow-[0_8px_18px_-4px_rgba(30,107,184,0.35),inset_0_2px_4px_rgba(255,255,255,0.65)]"
            :class="activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gradient-to-br from-brand-50 to-sky-100 dark:from-slate-800 dark:to-slate-700 text-brand-500 dark:text-brand-400'"
          >
            <LayoutGrid class="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm" />
          </div>
          <span class="text-[11px] sm:text-xs font-extrabold text-center leading-tight line-clamp-2">{{ t('nav.allCategories') }}</span>
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="activeCategory = cat.slug"
          class="group shrink-0 min-w-[96px] sm:min-w-[116px] flex flex-col items-center justify-center gap-2 p-2.5 sm:p-3 rounded-3xl border transition-all duration-300 cursor-pointer"
          :class="activeCategory === cat.slug
            ? 'bg-gradient-to-b from-brand-500 to-brand-600 text-white border-brand-500 shadow-lg shadow-brand-500/30 -translate-y-0.5'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 hover:-translate-y-0.5 shadow-sm'"
        >
          <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 p-0.5 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 shadow-[0_10px_20px_-5px_rgba(15,23,42,0.28),inset_0_2px_4px_rgba(255,255,255,0.85)]">
            <img
              v-if="cat.image"
              :src="cat.image"
              :alt="cat.name[lang]"
              class="w-full h-full rounded-[14px] object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-brand-500">
              <component :is="getCategoryIcon(cat.icon)" class="w-7 h-7 sm:w-8 sm:h-8 drop-shadow" />
            </div>
          </div>
          <span class="text-[11px] sm:text-xs font-extrabold text-center leading-tight line-clamp-2 max-w-[100px]">{{ cat.name[lang] }}</span>
        </button>
      </div>

      <!-- Products Grid -->
      <div
        v-if="filteredProducts.length > 0"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5"
      >
        <ProductCard
          v-for="(product, idx) in filteredProducts"
          :key="product.id"
          :product="product"
          :index="idx"
          @select="selectedProduct = $event"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4"
      >
        <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
          <PackageX class="w-7 h-7" />
        </div>
        <div class="space-y-1">
          <h3 class="font-black text-lg text-slate-900 dark:text-white">{{ t('catalog.noResults') }}</h3>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{{ t('catalog.noResultsHint') }}</p>
        </div>
        <button
          type="button"
          @click="resetFilters"
          class="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm cursor-pointer"
        >
          {{ t('catalog.resetFilters') }}
        </button>
      </div>
    </main>

    <StoreFooter />
    <ProductModal :product="selectedProduct" @close="selectedProduct = null" />

    <!-- Floating Draggable Category Filter Button -->
    <div
      v-if="categories.length > 0"
      ref="filterBtnRef"
      class="fixed z-50 touch-none select-none"
      :class="filterBtnPos ? '' : 'bottom-24 start-4 sm:start-6'"
      :style="filterBtnPos ? { left: `${filterBtnPos.x}px`, top: `${filterBtnPos.y}px` } : undefined"
    >
      <button
        type="button"
        @pointerdown="onFilterPointerDown"
        @pointermove="onFilterPointerMove"
        @pointerup="onFilterPointerUp"
        @pointercancel="isDraggingFilter = false"
        class="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-transform duration-200 active:scale-95 ring-4 ring-white/80 dark:ring-slate-900/80"
        :class="isDraggingFilter ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-105'"
        :title="lang === 'ar' ? 'تصفية حسب القسم (اسحب لتحريك الزر)' : 'Filter by Category (Drag to move)'"
        :aria-label="lang === 'ar' ? 'تصفية حسب القسم' : 'Filter by Category'"
      >
        <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <span
          v-if="activeCategory !== 'all'"
          class="absolute -top-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white dark:border-slate-900 animate-pulse"
        />
      </button>
    </div>

    <!-- Category Filter Sheet Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isFilterSheetOpen"
          class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          @click.self="isFilterSheetOpen = false"
        >
          <div
            :dir="lang === 'ar' ? 'rtl' : 'ltr'"
            class="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4 max-h-[80vh] flex flex-col"
          >
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <span class="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-sm">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                </span>
                <div>
                  <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {{ lang === 'ar' ? 'تصفح حسب القسم' : 'Browse by Category' }}
                  </h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">
                    {{ lang === 'ar' ? 'اختر القسم لعرض منتجاته مباشرة' : 'Select a category to filter products' }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="isFilterSheetOpen = false"
                class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div class="overflow-y-auto space-y-2 pe-1">
              <button
                type="button"
                @click="selectCategoryAndScroll('all')"
                class="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer border"
                :class="activeCategory === 'all'
                  ? 'bg-brand-500 text-white border-transparent shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'"
              >
                <div class="flex items-center gap-2.5">
                  <LayoutGrid class="w-5 h-5" />
                  <span>{{ lang === 'ar' ? 'كل الأقسام والمنتجات' : 'All Categories' }}</span>
                </div>
                <span v-if="activeCategory === 'all'">✓</span>
              </button>

              <button
                v-for="cat in categories"
                :key="`sheet-${cat.id}`"
                type="button"
                @click="selectCategoryAndScroll(cat.slug)"
                class="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border"
                :class="activeCategory === cat.slug
                  ? 'bg-brand-500 text-white border-transparent shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'"
              >
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 p-0.5 shadow-[0_6px_14px_-3px_rgba(15,23,42,0.25),inset_0_1px_3px_rgba(255,255,255,0.8)] shrink-0">
                    <img v-if="cat.image" :src="cat.image" :alt="cat.name[lang]" class="w-full h-full rounded-[13px] object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-brand-500">
                      <component :is="getCategoryIcon(cat.icon)" class="w-6 h-6" />
                    </div>
                  </div>
                  <span>{{ cat.name[lang] }}</span>
                </div>
                <span v-if="activeCategory === cat.slug">✓</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

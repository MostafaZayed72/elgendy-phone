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
    <StoreHero :carousel-products="latestProducts" @select="selectedProduct = $event" />
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

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" data-aos="fade-up" data-aos-delay="80">
        <button
          type="button"
          @click="activeCategory = 'all'"
          class="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer"
          :class="activeCategory === 'all'
            ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-brand-500/40'"
        >
          <LayoutGrid class="w-4 h-4" />
          <span>{{ t('nav.allCategories') }}</span>
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="activeCategory = cat.slug"
          class="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer"
          :class="activeCategory === cat.slug
            ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20'
            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-brand-500/40'"
        >
          <component :is="getCategoryIcon(cat.icon)" class="w-4 h-4" />
          <span>{{ cat.name[lang] }}</span>
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
  </div>
</template>

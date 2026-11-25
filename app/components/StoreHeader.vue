<script setup lang="ts">
import { Sun, Moon, Globe, ShoppingCart } from 'lucide-vue-next'
import { elgendyStore } from '~/data/elgendy-store'

const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const colorMode = useColorMode()
const { totalCount, totalPrice, openCart, loadFromStorage } = useCart()

const mounted = ref(false)
const isDark = computed(() => colorMode.value === 'dark')

onMounted(() => {
  mounted.value = true
  loadFromStorage()
})

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const oppositeLocale = computed(() => (locale.value === 'ar' ? 'en' : 'ar'))

const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const activeLogo = computed(() => {
  return mounted.value && isDark.value ? elgendyStore.logoDark : elgendyStore.logo
})
</script>

<template>
  <header class="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-sm">
    <div class="w-full px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
      <!-- Store Logo -->
      <button
        type="button"
        @click="scrollToTop"
        class="flex items-center group cursor-pointer focus:outline-none min-w-0 shrink"
        :title="t('nav.scrollToTop')"
      >
        <div class="h-11 xs:h-12 sm:h-14 flex items-center transition-transform duration-300 group-hover:scale-[1.03]">
          <img
            :src="activeLogo"
            :alt="t('store.name')"
            class="h-full w-auto max-w-[170px] xs:max-w-[210px] sm:max-w-[260px] object-contain select-none"
          />
        </div>
      </button>

      <!-- Controls: Cart + Language + Dark/Light Mode -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <!-- Cart Button -->
        <button
          type="button"
          @click="openCart"
          class="relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold transition-all cursor-pointer active:scale-95"
          :title="t('nav.cart')"
        >
          <div class="relative flex items-center justify-center">
            <ShoppingCart class="w-4 h-4 sm:w-5 sm:h-5 text-brand-500 dark:text-brand-400" />
            <span
              v-if="totalCount > 0"
              class="absolute -top-2.5 -end-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-500 text-white text-[10px] font-black flex items-center justify-center shadow animate-scale-in"
            >
              {{ totalCount }}
            </span>
          </div>
          <span class="text-xs sm:text-sm font-bold hidden sm:inline">{{ t('nav.cart') }}</span>
          <span
            v-if="totalCount > 0"
            class="text-xs font-black text-brand-600 dark:text-brand-400 ps-1.5 border-s border-slate-200 dark:border-slate-700 hidden md:inline"
          >
            {{ totalPrice.toLocaleString('en-US') }} {{ t('catalog.egp') }}
          </span>
        </button>

        <!-- Language Switcher -->
        <NuxtLink
          :to="switchLocalePath(oppositeLocale)"
          class="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition-all active:scale-95"
        >
          <Globe class="w-4 h-4 text-brand-500 dark:text-brand-400" />
          <span>{{ t('nav.switchLang') }}</span>
        </NuxtLink>

        <!-- Dark / Light Mode Toggle -->
        <button
          type="button"
          @click="toggleTheme"
          class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95"
          :title="t('nav.toggleTheme')"
          :aria-label="t('nav.toggleTheme')"
        >
          <Sun v-if="mounted && isDark" class="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <Moon v-else class="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
        </button>
      </div>
    </div>
  </header>
</template>

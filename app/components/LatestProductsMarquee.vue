<script setup lang="ts">
import { Sparkles, Flame } from 'lucide-vue-next'
import type { Product } from '~/types/store'

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  (e: 'select', product: Product): void
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'ar'))
const isRtl = computed(() => lang.value === 'ar')
const isTouchPaused = ref(false)

// Repeat base items enough to cover wide screens seamlessly with zero gaps
const baseGroupProducts = computed(() => {
  if (!props.products || props.products.length === 0) return []
  const minItemsForWideScreens = 16
  const repeatCount = Math.max(1, Math.ceil(minItemsForWideScreens / props.products.length))
  const repeated: Product[] = []
  for (let i = 0; i < repeatCount; i++) {
    repeated.push(...props.products)
  }
  return repeated
})

const animationDuration = computed(() => {
  const count = baseGroupProducts.value.length || 1
  return `${Math.max(24, count * 3.2)}s`
})
</script>

<template>
  <section
    v-if="products && products.length > 0"
    class="w-full py-4 sm:py-5 bg-white/80 dark:bg-slate-900/60 border-b border-slate-200/70 dark:border-slate-800/70 overflow-hidden"
  >
    <!-- Marquee Header -->
    <div class="w-full px-4 sm:px-6 lg:px-10 mb-3 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-brand-500 text-white shadow-xs">
          <Flame class="w-4 h-4" />
        </span>
        <div>
          <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
            {{ lang === 'ar' ? 'أحدث المنتجات' : 'Latest Arrivals' }}
          </h3>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {{ lang === 'ar' ? 'تصفح أحدث الإضافات في المتجر' : 'Explore our newest additions' }}
          </p>
        </div>
      </div>

      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Sparkles class="w-3 h-3" />
        <span>{{ lang === 'ar' ? `أحدث ${products.length} منتجات` : `Top ${products.length} New` }}</span>
      </span>
    </div>

    <!-- Seamless Infinite Marquee Track -->
    <div
      class="marquee-wrapper relative w-full overflow-hidden group"
      dir="ltr"
      @touchstart.passive="isTouchPaused = true"
      @touchend.passive="isTouchPaused = false"
      @touchcancel.passive="isTouchPaused = false"
    >
      <!-- Left & Right Fade Gradients -->
      <div class="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-white/95 dark:from-slate-950/95 to-transparent" />
      <div class="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-white/95 dark:from-slate-950/95 to-transparent" />

      <div
        class="marquee-track flex w-max"
        :class="{ 'is-touch-paused': isTouchPaused }"
        :style="{ animationDuration }"
      >
        <div
          v-for="groupCopy in 2"
          :key="`group-${groupCopy}`"
          class="flex shrink-0 gap-3 sm:gap-4 pr-3 sm:pr-4"
        >
          <NuxtLink
            v-for="(product, idx) in baseGroupProducts"
            :key="`${groupCopy}-${product.id}-${idx}`"
            :to="localePath(`/products/${product.id}`)"
            :dir="isRtl ? 'rtl' : 'ltr'"
            class="w-[148px] sm:w-[184px] shrink-0 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col text-start cursor-pointer"
          >
            <div class="p-1.5 pb-0">
              <div class="relative aspect-square w-full rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img
                  v-if="product.image"
                  :src="product.image"
                  :alt="product.name[lang]"
                  class="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <span
                  v-if="product.badge"
                  class="absolute top-2 start-2 px-2 py-0.5 rounded-full bg-brand-500/95 text-[10px] font-black text-white shadow-xs"
                >
                  {{ product.badge[lang] }}
                </span>
              </div>
            </div>

            <div class="p-2.5 flex-1 flex flex-col justify-between gap-1 w-full">
              <h4 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                {{ product.name[lang] }}
              </h4>
              <div v-if="product.price > 0" class="flex items-baseline gap-1">
                <span class="text-xs sm:text-sm font-black text-brand-600 dark:text-brand-400">
                  {{ product.price.toLocaleString('en-US') }}
                </span>
                <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {{ t('catalog.egp') }}
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee-track {
  animation-name: marquee-scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

@media (hover: hover) and (pointer: fine) {
  .marquee-wrapper:hover .marquee-track {
    animation-play-state: paused;
  }
}

.marquee-track.is-touch-paused {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>

<script setup lang="ts">
import { Sparkles, ArrowUpRight } from 'lucide-vue-next'
import type { HeroSettings, Product } from '~/types/store'
import { elgendyStore } from '~/data/elgendy-store'

const props = defineProps<{
  carouselProducts?: Product[]
  settings?: HeroSettings
}>()

const emit = defineEmits<{
  (e: 'select', product: Product): void
}>()

const { locale, t } = useI18n()
const localePath = useLocalePath()
const lang = computed(() => (locale.value === 'en' ? 'en' : 'ar'))

const slides = computed(() => {
  return (props.carouselProducts || []).filter(p => Boolean(p.image))
})

const activeSlideIndex = ref(0)
let carouselTimer: ReturnType<typeof setInterval> | null = null

const currentSlideProduct = computed(() => {
  if (slides.value.length === 0) return null
  return slides.value[activeSlideIndex.value % slides.value.length] || null
})

const startCarousel = () => {
  if (carouselTimer) clearInterval(carouselTimer)
  if (!import.meta.client || slides.value.length <= 1) return
  carouselTimer = setInterval(() => {
    if (slides.value.length > 1) {
      activeSlideIndex.value = (activeSlideIndex.value + 1) % slides.value.length
    }
  }, 3500)
}

const goToSlide = (idx: number) => {
  activeSlideIndex.value = idx
  startCarousel()
}

watch(() => slides.value.length, () => {
  activeSlideIndex.value = 0
  startCarousel()
})

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  if (carouselTimer) clearInterval(carouselTimer)
})
</script>

<template>
  <section
    class="relative w-full overflow-hidden min-h-[320px] sm:min-h-[400px] md:min-h-[470px] flex flex-col items-center justify-center border-b border-slate-200/60 dark:border-slate-800/70"
    :class="slides.length > 0 ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950'"
    data-aos="fade-down"
  >
    <!-- Full-bleed background carousel (switches every 3.5 seconds, natural colors without shading) -->
    <div v-if="slides.length > 0" class="absolute inset-0 z-0 pointer-events-none select-none">
      <div
        v-for="(product, idx) in slides"
        :key="`bg-${product.id}`"
        class="absolute inset-0 transition-opacity duration-700 ease-in-out"
        :class="idx === (activeSlideIndex % slides.length) ? 'opacity-100' : 'opacity-0'"
      >
        <img
          :src="product.image"
          :alt="product.name[lang]"
          class="w-full h-full object-cover object-center"
          :loading="idx === 0 ? 'eager' : 'lazy'"
          decoding="async"
        />
      </div>
    </div>

    <!-- Centered Store Title, Tagline, Active Product Pill & Dots -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 py-10 sm:py-14 text-center space-y-4 w-full">
      <div
        class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs backdrop-blur-md"
        :class="slides.length > 0
          ? 'bg-slate-950/45 text-white border border-white/25'
          : 'bg-brand-500/10 text-brand-500 border border-brand-500/20'"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>{{ settings?.heroBadge?.[lang] || (lang === 'ar' ? 'كتالوج المنتجات الرسمي' : 'Official Product Catalog') }}</span>
      </div>

      <div class="space-y-2 max-w-3xl mx-auto px-2">
        <h1
          class="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight break-words"
          :class="slides.length > 0 ? 'text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]' : 'text-slate-900 dark:text-white'"
        >
          {{ settings?.heroTitle?.[lang] || elgendyStore.name.en }}
        </h1>
        <p
          class="text-xs sm:text-sm md:text-base font-semibold max-w-xl mx-auto leading-relaxed"
          :class="slides.length > 0 ? 'text-slate-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]' : 'text-slate-600 dark:text-slate-400'"
        >
          {{ settings?.heroTagline?.[lang] || t('store.tagline') }}
        </p>
      </div>

      <!-- Current Slide Product Pill & Carousel Indicators -->
      <div v-if="slides.length > 0 && currentSlideProduct" class="pt-2 flex flex-col items-center gap-2.5">
        <NuxtLink
          :to="localePath(`/products/${currentSlideProduct.id}`)"
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/55 hover:bg-slate-950/75 backdrop-blur-md border border-white/25 text-white text-xs font-bold transition-all shadow-md max-w-[90vw] sm:max-w-md cursor-pointer"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span class="truncate">{{ currentSlideProduct.name[lang] }}</span>
          <span v-if="currentSlideProduct.price > 0" class="text-amber-300 font-black shrink-0">
            {{ currentSlideProduct.price.toLocaleString('en-US') }} {{ t('catalog.egp') }}
          </span>
          <ArrowUpRight class="w-3.5 h-3.5 shrink-0 opacity-85" />
        </NuxtLink>

        <div v-if="slides.length > 1" class="flex items-center justify-center gap-1.5">
          <button
            v-for="(slide, idx) in slides"
            :key="`dot-${slide.id}`"
            type="button"
            @click="goToSlide(idx)"
            class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
            :class="idx === (activeSlideIndex % slides.length) ? 'w-6 bg-white shadow-sm' : 'w-1.5 bg-white/45 hover:bg-white/75'"
            :aria-label="slide.name[lang]"
          />
        </div>
      </div>
    </div>
  </section>
</template>

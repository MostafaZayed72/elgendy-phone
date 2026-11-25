<script setup lang="ts">
import { ShoppingBag, Eye } from 'lucide-vue-next'
import type { Product } from '~/types/store'

const props = defineProps<{
  product: Product
  index?: number
}>()

const emit = defineEmits<{
  (e: 'select', product: Product): void
}>()

const { locale, t } = useI18n()
const { addToCart } = useCart()
const { showToast } = useToast()

const lang = computed(() => (locale.value === 'en' ? 'en' : 'ar'))

const discountPercent = computed(() => {
  if (!props.product.originalPrice || props.product.originalPrice <= props.product.price) return 0
  return Math.round(((props.product.originalPrice - props.product.price) / props.product.originalPrice) * 100)
})

const handleQuickAdd = (e: Event) => {
  e.stopPropagation()
  const defaultOption = props.product.options?.[0]
  const defaultColor = props.product.colors?.[0]
  const added = addToCart(props.product, 1, defaultOption, defaultColor)
  if (added) {
    showToast(t('catalog.addedToCart'))
  }
}
</script>

<template>
  <article
    @click="emit('select', product)"
    class="group relative flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-brand-500/40 dark:hover:border-brand-400/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
    data-aos="fade-up"
    :data-aos-delay="Math.min((index || 0) * 50, 250)"
  >
    <!-- Product Image -->
    <div class="p-2 sm:p-2.5 pb-0">
      <div class="relative aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-800/80 overflow-hidden shadow-xs">
        <img
          :src="product.image"
          :alt="product.name[lang]"
          class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <!-- Top Badges -->
        <div class="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          <span
            v-if="product.badge"
            class="px-2.5 py-0.5 rounded-full bg-brand-500/95 backdrop-blur-xs text-white text-[10px] sm:text-xs font-extrabold shadow-sm truncate"
          >
            {{ product.badge[lang] }}
          </span>
          <span v-else />
          <span
            v-if="discountPercent > 0"
            class="px-2 py-0.5 rounded-full bg-rose-500/95 backdrop-blur-xs text-white text-[10px] font-black shadow-sm shrink-0"
          >
            -{{ discountPercent }}%
          </span>
        </div>

        <!-- Quick View Pill -->
        <div class="absolute bottom-2.5 end-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 text-xs font-bold shadow-md backdrop-blur-sm">
          <Eye class="w-3.5 h-3.5 text-brand-500" />
          <span>{{ t('catalog.viewDetails') }}</span>
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="flex flex-col flex-1 p-3.5 sm:p-4 gap-2.5">
      <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-snug min-h-[2.5rem]">
        {{ product.name[lang] }}
      </h3>

      <!-- Price Row -->
      <div class="mt-auto pt-1 flex items-baseline justify-between gap-2 flex-wrap">
        <div class="flex items-baseline gap-1.5">
          <span class="text-base sm:text-lg font-black text-brand-600 dark:text-brand-400">
            {{ product.price.toLocaleString('en-US') }}
          </span>
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400">
            {{ t('catalog.egp') }}
          </span>
        </div>
        <span
          v-if="product.originalPrice && product.originalPrice > product.price"
          class="text-xs text-slate-400 line-through font-medium"
        >
          {{ product.originalPrice.toLocaleString('en-US') }}
        </span>
      </div>

      <!-- Add to Cart Button -->
      <button
        type="button"
        :disabled="product.isOutOfStock"
        @click="handleQuickAdd"
        class="w-full mt-1 py-2.5 px-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        :class="product.isOutOfStock
          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
          : 'bg-slate-900 dark:bg-brand-500 hover:bg-brand-500 dark:hover:bg-brand-600 text-white shadow-sm'"
      >
        <ShoppingBag class="w-4 h-4" />
        <span>{{ product.isOutOfStock ? t('catalog.outOfStock') : t('catalog.addToCart') }}</span>
      </button>
    </div>
  </article>
</template>

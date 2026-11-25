<script setup lang="ts">
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-vue-next'
import type { Product } from '~/types/store'
import { elgendyStore } from '~/data/elgendy-store'

const props = defineProps<{
  product: Product | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { locale, t } = useI18n()
const { addToCart } = useCart()
const { showToast } = useToast()

const lang = computed(() => (locale.value === 'en' ? 'en' : 'ar'))

const selectedColor = ref<string>('')
const selectedOption = ref<string>('')
const quantity = ref<number>(1)
const notes = ref<string>('')

watch(() => props.product, (p) => {
  if (p) {
    selectedColor.value = p.colors?.[0] || ''
    selectedOption.value = p.options?.[0] || ''
    quantity.value = 1
    notes.value = ''
  }
})

const handleAddToCart = () => {
  if (!props.product) return
  const added = addToCart(
    props.product,
    quantity.value,
    selectedOption.value || undefined,
    selectedColor.value || undefined,
    notes.value || undefined
  )
  if (added) {
    showToast(t('catalog.addedToCart'))
    emit('close')
  }
}

const directWhatsappUrl = computed(() => {
  if (!props.product) return '#'
  const isAr = lang.value === 'ar'
  const lines = [
    isAr ? `مرحباً متجر الجندي، أود طلب المنتج التالي:` : `Hello EL-GENDY Store, I would like to order:`,
    `*${props.product.name[lang.value]}*`,
    `${isAr ? 'الكمية' : 'Qty'}: ${quantity.value}`,
    `${isAr ? 'السعر' : 'Price'}: ${(props.product.price * quantity.value).toLocaleString('en-US')} ${t('catalog.egp')}`
  ]
  if (selectedColor.value) lines.push(`${t('catalog.color')}: ${selectedColor.value}`)
  if (selectedOption.value) lines.push(`${t('catalog.option')}: ${selectedOption.value}`)
  if (notes.value.trim()) lines.push(`${t('catalog.notes')}: ${notes.value.trim()}`)

  return `https://wa.me/${elgendyStore.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
})
</script>

<template>
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
        v-if="product"
        class="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
        @click.self="emit('close')"
      >
        <div class="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <!-- Close Button -->
          <button
            type="button"
            @click="emit('close')"
            class="sticky top-3 float-end me-3 mt-3 z-20 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 sm:p-6">
            <!-- Image -->
            <div class="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800/70 overflow-hidden shadow-sm">
              <img
                :src="product.image"
                :alt="product.name[lang]"
                class="w-full h-full object-cover object-center"
              />
            </div>

            <!-- Details -->
            <div class="flex flex-col gap-4">
              <div>
                <span
                  v-if="product.badge"
                  class="inline-block px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-extrabold mb-2"
                >
                  {{ product.badge[lang] }}
                </span>
                <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {{ product.name[lang] }}
                </h2>
              </div>

              <!-- Price -->
              <div class="flex items-baseline gap-2.5">
                <span class="text-2xl font-black text-brand-600 dark:text-brand-400">
                  {{ product.price.toLocaleString('en-US') }} {{ t('catalog.egp') }}
                </span>
                <span
                  v-if="product.originalPrice && product.originalPrice > product.price"
                  class="text-sm text-slate-400 line-through"
                >
                  {{ product.originalPrice.toLocaleString('en-US') }} {{ t('catalog.egp') }}
                </span>
              </div>

              <!-- Description -->
              <div class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {{ product.description[lang] }}
              </div>

              <!-- Options -->
              <div v-if="product.options?.length" class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ t('catalog.option') }}</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="opt in product.options"
                    :key="opt"
                    type="button"
                    @click="selectedOption = opt"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1"
                    :class="selectedOption === opt
                      ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'"
                  >
                    <Check v-if="selectedOption === opt" class="w-3.5 h-3.5" />
                    <span>{{ opt }}</span>
                  </button>
                </div>
              </div>

              <!-- Colors -->
              <div v-if="product.colors?.length" class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 dark:text-slate-400">{{ t('catalog.color') }}</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="col in product.colors"
                    :key="col"
                    type="button"
                    @click="selectedColor = col"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer"
                    :class="selectedColor === col
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'"
                  >
                    {{ col }}
                  </button>
                </div>
              </div>

              <!-- Quantity & Notes -->
              <div class="grid grid-cols-3 gap-2.5 items-end">
                <div>
                  <label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">{{ t('catalog.quantity') }}</label>
                  <div class="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1.5">
                    <button type="button" @click="quantity = Math.max(1, quantity - 1)" class="p-1 text-slate-600 dark:text-slate-300 cursor-pointer">
                      <Minus class="w-3.5 h-3.5" />
                    </button>
                    <span class="font-black text-sm">{{ quantity }}</span>
                    <button type="button" @click="quantity++" class="p-1 text-slate-600 dark:text-slate-300 cursor-pointer">
                      <Plus class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div class="col-span-2">
                  <label class="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">{{ t('catalog.notes') }}</label>
                  <input
                    v-model="notes"
                    type="text"
                    :placeholder="t('catalog.notesPlaceholder')"
                    class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  :disabled="product.isOutOfStock"
                  @click="handleAddToCart"
                  class="flex-1 py-3 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingBag class="w-4 h-4" />
                  <span>{{ t('catalog.addToCart') }}</span>
                </button>
                <a
                  :href="directWhatsappUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <WhatsAppIcon class="w-4 h-4" />
                  <span>{{ t('catalog.orderNowWhatsapp') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

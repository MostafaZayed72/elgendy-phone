<script setup lang="ts">
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-vue-next'

const { locale, t } = useI18n()
const {
  items,
  isOpen,
  customer,
  totalCount,
  totalPrice,
  closeCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  saveCustomer,
  buildWhatsAppOrderUrl
} = useCart()

const lang = computed(() => (locale.value === 'en' ? 'en' : 'ar'))

watch(customer, () => {
  saveCustomer()
}, { deep: true })

const checkoutUrl = computed(() => buildWhatsAppOrderUrl(lang.value))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[65] bg-slate-950/60 backdrop-blur-xs flex justify-end"
        @click.self="closeCart"
      >
        <aside class="w-full max-w-md h-full bg-white dark:bg-slate-900 border-s border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          <!-- Drawer Header -->
          <div class="px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <ShoppingBag class="w-5 h-5" />
              </div>
              <div>
                <h2 class="font-black text-base text-slate-900 dark:text-white">{{ t('cart.title') }}</h2>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ totalCount }} {{ t('cart.itemsCount') }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                v-if="items.length > 0"
                type="button"
                @click="clearCart"
                class="text-xs font-bold text-rose-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                {{ t('cart.clear') }}
              </button>
              <button
                type="button"
                @click="closeCart"
                class="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="items.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <ShoppingBag class="w-8 h-8" />
            </div>
            <div class="space-y-1">
              <h3 class="font-black text-lg text-slate-900 dark:text-white">{{ t('cart.emptyTitle') }}</h3>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs">{{ t('cart.emptyDesc') }}</p>
            </div>
            <button
              type="button"
              @click="closeCart"
              class="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm cursor-pointer"
            >
              {{ t('cart.browseCatalog') }}
            </button>
          </div>

          <!-- Cart Items + Customer Form -->
          <div v-else class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div
              v-for="item in items"
              :key="item.id"
              class="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70"
            >
              <img
                :src="item.selectedImage || item.product.image"
                :alt="item.product.name[lang]"
                class="w-16 h-16 rounded-xl object-cover object-center bg-white dark:bg-slate-900 shrink-0"
              />
              <div class="flex-1 min-w-0 space-y-1">
                <div class="flex items-start justify-between gap-2">
                  <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2">
                    {{ item.product.name[lang] }}
                  </h4>
                  <button
                    type="button"
                    @click="removeFromCart(item.id)"
                    class="text-slate-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
                    :title="t('cart.remove')"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <div class="flex flex-wrap gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span v-if="item.color" class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">{{ item.color }}</span>
                  <span v-if="item.selectedOption" class="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">{{ item.selectedOption }}</span>
                </div>

                <div class="flex items-center justify-between pt-1">
                  <span class="font-black text-sm text-brand-600 dark:text-brand-400">
                    {{ (item.price * item.quantity).toLocaleString('en-US') }} {{ t('catalog.egp') }}
                  </span>

                  <div class="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1">
                    <button type="button" @click="updateQuantity(item.id, item.quantity - 1)" class="text-slate-600 dark:text-slate-300 cursor-pointer">
                      <Minus class="w-3.5 h-3.5" />
                    </button>
                    <span class="text-xs font-black min-w-[16px] text-center">{{ item.quantity }}</span>
                    <button type="button" @click="updateQuantity(item.id, item.quantity + 1)" class="text-slate-600 dark:text-slate-300 cursor-pointer">
                      <Plus class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Customer Details Form (saved in localStorage) -->
            <div class="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <input
                v-model="customer.name"
                type="text"
                :placeholder="t('cart.customerNamePlaceholder')"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                v-model="customer.phone"
                type="tel"
                :placeholder="t('cart.customerPhonePlaceholder')"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                v-model="customer.address"
                type="text"
                :placeholder="t('cart.customerAddressPlaceholder')"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <textarea
                v-model="customer.notes"
                rows="2"
                :placeholder="t('cart.orderNotesPlaceholder')"
                class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              ></textarea>
              <p class="text-[11px] text-slate-400 text-center">{{ t('cart.savedLocally') }}</p>
            </div>
          </div>

          <!-- Drawer Footer -->
          <div v-if="items.length > 0" class="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-slate-600 dark:text-slate-300">{{ t('cart.total') }}</span>
              <span class="text-xl font-black text-brand-600 dark:text-brand-400">
                {{ totalPrice.toLocaleString('en-US') }} {{ t('catalog.egp') }}
              </span>
            </div>
            <a
              :href="checkoutUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <WhatsAppIcon class="w-5 h-5" />
              <span>{{ t('cart.checkoutWhatsapp') }}</span>
            </a>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

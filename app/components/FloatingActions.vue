<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'
import { elgendyStore } from '~/data/elgendy-store'

const { t, locale } = useI18n()
const showScrollTop = ref(false)

const whatsappUrl = computed(() => {
  const msg = locale.value === 'ar'
    ? 'مرحباً متجر الجندي، أود التواصل والاستفسار عن المنتجات.'
    : 'Hello EL-GENDY Mobile Store, I would like to inquire about your products.'
  return `https://wa.me/${elgendyStore.whatsappNumber}?text=${encodeURIComponent(msg)}`
})

const handleScroll = () => {
  if (import.meta.client) {
    showScrollTop.value = window.scrollY > 280
  }
}

const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="fixed bottom-4 end-4 sm:bottom-6 sm:end-6 z-50 flex flex-col items-center gap-3">
    <!-- Scroll Up Button -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-75"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-75"
    >
      <button
        v-if="showScrollTop"
        type="button"
        @click="scrollToTop"
        class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        :title="t('floating.scrollTop')"
        :aria-label="t('floating.scrollTop')"
      >
        <ArrowUp class="w-5 h-5" />
      </button>
    </Transition>

    <!-- Floating WhatsApp Button -->
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      :title="t('floating.whatsapp')"
      :aria-label="t('floating.whatsapp')"
    >
      <span class="absolute -inset-1 rounded-2xl bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>
      <WhatsAppIcon class="w-7 h-7 sm:w-8 sm:h-8 relative z-10" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { Phone, ShieldCheck, Truck, Award, Smartphone, ArrowDown } from 'lucide-vue-next'
import { elgendyStore } from '~/data/elgendy-store'

const { t, locale } = useI18n()

const whatsappUrl = computed(() => {
  const msg = locale.value === 'ar'
    ? 'مرحباً متجر الجندي، أود الاستفسار عن الهواتف والإكسسوارات المتاحة.'
    : 'Hello EL-GENDY Mobile Store, I would like to inquire about available phones & accessories.'
  return `https://wa.me/${elgendyStore.whatsappNumber}?text=${encodeURIComponent(msg)}`
})

const scrollToCatalog = () => {
  if (import.meta.client) {
    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/70 dark:border-slate-800/70">
    <!-- Subtle tech background glow -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-24 -end-24 w-80 h-80 rounded-full bg-brand-500/10 dark:bg-brand-500/15 blur-3xl"></div>
      <div class="absolute -bottom-24 -start-24 w-72 h-72 rounded-full bg-sky-400/10 dark:bg-sky-500/10 blur-3xl"></div>
    </div>

    <div class="relative max-w-6xl mx-auto px-4 py-10 sm:py-14 md:py-16">
      <div class="max-w-3xl mx-auto text-center space-y-5" data-aos="fade-up">
        <!-- Heritage Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-400/15 border border-brand-500/20 text-brand-600 dark:text-brand-300 text-xs sm:text-sm font-extrabold">
          <Award class="w-4 h-4 shrink-0" />
          <span>{{ t('store.badge') }}</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          {{ t('store.name') }}
          <span class="block text-lg sm:text-xl md:text-2xl font-bold text-brand-500 dark:text-brand-400 mt-1.5">
            EL-GENDY Mobile Store — {{ t('store.since') }}
          </span>
        </h1>

        <!-- Tagline -->
        <p class="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {{ t('store.tagline') }}
        </p>

        <!-- Primary Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            @click="scrollToCatalog"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
          >
            <Smartphone class="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{{ t('hero.ctaBrowse') }}</span>
            <ArrowDown class="w-4 h-4" />
          </button>

          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <WhatsAppIcon class="w-5 h-5" />
            <span>{{ t('hero.ctaWhatsapp') }}</span>
          </a>

          <a
            href="tel:01276677717"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 font-extrabold text-sm sm:text-base shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Phone class="w-4 h-4 text-brand-500" />
            <span class="dir-ltr">01276677717</span>
          </a>
        </div>
      </div>

      <!-- Trust Highlights -->
      <div
        class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-10 sm:mt-12"
        data-aos="fade-up"
        data-aos-delay="120"
      >
        <div class="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div class="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
            <Award class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{{ t('hero.statExperience') }}</p>
            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{{ t('hero.statSince') }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{{ t('hero.statOriginal') }}</p>
            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">EL-GENDY Warranty</p>
          </div>
        </div>

        <div class="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
            <Truck class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{{ t('hero.statDelivery') }}</p>
            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">Express Shipping</p>
          </div>
        </div>

        <a
          href="tel:0235822857"
          class="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-brand-500/40 transition-colors"
        >
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Phone class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate dir-ltr">0235822857</p>
            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{{ t('footer.landlineBadge') }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Phone, PhoneCall, Copy, Check, Clock, Truck } from 'lucide-vue-next'
import { elgendyStore } from '~/data/elgendy-store'

const { t, locale } = useI18n()
const colorMode = useColorMode()
const { showToast } = useToast()

const zaydexWhatsappUrl = computed(() => {
  const msg = locale.value === 'ar'
    ? 'مرحباً، أريد الاستفسار عن إنشاء متجر / كتالوج مثل متجر الجندي للموبايلات عبر منصة Zaydex'
    : 'Hello, I want to inquire about creating a catalog store like EL-GENDY Mobile Store on Zaydex'
  return `https://wa.me/201099658770?text=${encodeURIComponent(msg)}`
})

const mounted = ref(false)
const copiedId = ref<string | null>(null)
const currentYear = new Date().getFullYear()

onMounted(() => {
  mounted.value = true
})

const activeLogo = computed(() => {
  return mounted.value && colorMode.value === 'dark' ? elgendyStore.logoDark : elgendyStore.logo
})

const copyNumber = async (num: string, id: string) => {
  if (!import.meta.client) return
  try {
    await navigator.clipboard.writeText(num)
    copiedId.value = id
    showToast(`${t('footer.copied')}: ${num}`)
    setTimeout(() => {
      if (copiedId.value === id) copiedId.value = null
    }, 2000)
  } catch {
    // ignore clipboard errors
  }
}

const getBadgeLabel = (type: 'whatsapp' | 'mobile' | 'landline') => {
  if (type === 'whatsapp') return t('footer.whatsappBadge')
  if (type === 'landline') return t('footer.landlineBadge')
  return t('footer.mobileBadge')
}
</script>

<template>
  <footer class="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md pt-12 pb-8 transition-colors">
    <div class="w-full px-4 sm:px-6 lg:px-10 space-y-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <!-- Brand Column -->
        <div class="space-y-4">
          <img
            :src="activeLogo"
            :alt="t('store.name')"
            class="h-14 w-auto object-contain"
          />
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ t('footer.aboutText') }}
          </p>
        </div>

        <!-- Contact Numbers Column (All 4 Numbers Linked) -->
        <div class="space-y-3">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {{ t('footer.contactTitle') }}
          </h4>
          <div class="space-y-2.5">
            <div
              v-for="contact in elgendyStore.contacts"
              :key="contact.id"
              class="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <a
                  v-if="contact.type === 'whatsapp'"
                  :href="`https://wa.me/${contact.whatsappFormatted}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0 hover:bg-[#25D366] hover:text-white transition-colors"
                  title="WhatsApp"
                >
                  <WhatsAppIcon class="w-4 h-4" />
                </a>
                <a
                  v-else-if="contact.type === 'landline'"
                  :href="`tel:${contact.number}`"
                  class="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 hover:bg-amber-500 hover:text-white transition-colors"
                >
                  <PhoneCall class="w-4 h-4" />
                </a>
                <a
                  v-else
                  :href="`tel:${contact.number}`"
                  class="w-8 h-8 rounded-xl bg-brand-500/15 text-brand-500 flex items-center justify-center shrink-0 hover:bg-brand-500 hover:text-white transition-colors"
                >
                  <Phone class="w-4 h-4" />
                </a>

                <div class="min-w-0">
                  <a
                    :href="`tel:${contact.number}`"
                    class="font-black text-sm text-slate-800 dark:text-slate-100 hover:text-brand-500 transition-colors dir-ltr block"
                  >
                    {{ contact.number }}
                  </a>
                  <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {{ getBadgeLabel(contact.type) }}
                  </span>
                </div>
              </div>

              <button
                type="button"
                @click="copyNumber(contact.number, contact.id)"
                class="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-500 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Check v-if="copiedId === contact.id" class="w-3.5 h-3.5 text-emerald-500" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedId === contact.id ? t('footer.copied') : t('footer.copy') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Hours & Delivery Column -->
        <div class="space-y-3">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            {{ t('footer.hoursTitle') }}
          </h4>
          <div class="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70">
            <div class="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
              <Clock class="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <span class="text-xs sm:text-sm font-semibold">{{ t('footer.hoursText') }}</span>
            </div>
            <div class="flex items-start gap-2.5 text-slate-700 dark:text-slate-200">
              <Truck class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span class="text-xs sm:text-sm font-semibold">{{ t('footer.serviceText') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar + Powered by Zaydex -->
      <div class="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <p>© {{ currentYear }} {{ t('footer.rights') }}</p>
          <span class="text-slate-300 dark:text-slate-700">|</span>
          <NuxtLink to="/admin" class="hover:text-brand-500 transition-colors font-bold">
            لوحة التحكم
          </NuxtLink>
        </div>

        <a
          :href="`https://wa.me/201099658770?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن إنشاء متجر / كتالوج مثل متجر الجندي للموبايلات عبر منصة Zaydex')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-xs hover:shadow-sm"
          dir="ltr"
        >
          <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">Powered by</span>
          <img
            src="/images/zaydex/logo.png"
            alt="Zaydex"
            class="h-5 w-auto object-contain dark:hidden group-hover:scale-105 transition-transform"
          />
          <img
            src="/images/zaydex/logo-dark.png"
            alt="Zaydex"
            class="h-5 w-auto object-contain hidden dark:block group-hover:scale-105 transition-transform"
          />
          <span class="text-xs font-black text-slate-800 dark:text-white tracking-tight">Zaydex</span>
        </a>
      </div>
    </div>
  </footer>
</template>

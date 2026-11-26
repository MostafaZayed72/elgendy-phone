<script setup lang="ts">
import { Download, Smartphone, X, Share, PlusSquare } from 'lucide-vue-next'

const { locale } = useI18n()
const isAr = computed(() => locale.value === 'ar')

const {
  canShowButton,
  showIosGuide,
  init,
  triggerInstall,
  dismiss
} = usePwaInstall()

onMounted(() => {
  init()
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4 scale-90"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-4 scale-90"
  >
    <div
      v-if="canShowButton"
      class="fixed bottom-4 start-4 sm:bottom-6 sm:start-6 z-50"
    >
      <div class="relative group flex items-center">
        <!-- Direct 1-Click Install Floating Button -->
        <button
          type="button"
          @click="triggerInstall"
          class="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 shadow-xl hover:shadow-2xl border border-slate-700/60 dark:border-slate-200 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          :title="isAr ? 'تثبيت التطبيق على جهازك' : 'Install App'"
        >
          <span class="relative flex h-2 w-2 shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>

          <Smartphone class="w-4 h-4 text-brand-400 dark:text-brand-600 shrink-0" />
          <span class="text-xs sm:text-sm font-extrabold tracking-tight">
            {{ isAr ? 'تثبيت التطبيق' : 'Install App' }}
          </span>
          <Download class="w-3.5 h-3.5 opacity-80 group-hover:translate-y-0.5 transition-transform shrink-0" />
        </button>

        <!-- Dismiss -->
        <button
          type="button"
          @click.stop="dismiss"
          class="absolute -top-2 -end-2 w-5 h-5 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-600 flex items-center justify-center shadow-xs cursor-pointer"
          :aria-label="isAr ? 'إغلاق' : 'Close'"
        >
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- iOS Safari Share-to-Install Guide (only for iPhone/iPad) -->
      <Teleport to="body">
        <div
          v-if="showIosGuide"
          class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
          @click.self="showIosGuide = false"
        >
          <div
            :dir="isAr ? 'rtl' : 'ltr'"
            class="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl space-y-4"
          >
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2 font-black text-base text-slate-900 dark:text-white">
                <Smartphone class="w-5 h-5 text-brand-500" />
                <span>{{ isAr ? 'تثبيت التطبيق على آيفون' : 'Install on iPhone' }}</span>
              </div>
              <button
                type="button"
                @click="showIosGuide = false"
                class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <div class="space-y-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
              <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <Share class="w-5 h-5 text-brand-500 shrink-0" />
                <span>{{ isAr ? '1. اضغط على زر المشاركة في شريط سفاري بالأسفل' : '1. Tap the Share button at the bottom of Safari' }}</span>
              </div>
              <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <PlusSquare class="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{{ isAr ? '2. اختر «إضافة إلى الشاشة الرئيسية»' : '2. Tap "Add to Home Screen"' }}</span>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </Transition>
</template>

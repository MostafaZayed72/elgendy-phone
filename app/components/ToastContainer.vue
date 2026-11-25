<script setup lang="ts">
import { CheckCircle2, Info } from 'lucide-vue-next'

const { toasts } = useToast()
</script>

<template>
  <div class="fixed top-20 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-[70] flex flex-col gap-2 pointer-events-none w-[90%] max-w-sm">
    <TransitionGroup
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="opacity-0 -translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 shadow-xl backdrop-blur-md text-xs sm:text-sm font-bold"
      >
        <CheckCircle2 v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
        <Info v-else class="w-4 h-4 text-brand-400 dark:text-brand-600 shrink-0" />
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { Lock, User, LogIn, ArrowRight, Loader2 } from 'lucide-vue-next'
import { elgendyStore } from '~/data/elgendy-store'

definePageMeta({
  layout: false
})

const colorMode = useColorMode()
const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const res = await $fetch<{ authenticated: boolean }>('/api/auth/me')
    if (res.authenticated) {
      navigateTo('/admin')
    }
  } catch {
    // ignore
  }
})

const handleLogin = async () => {
  errorMsg.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value
      }
    })
    await navigateTo('/admin')
  } catch (err: any) {
    errorMsg.value = err?.data?.statusMessage || err?.statusMessage || 'بيانات الدخول غير صحيحة'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div dir="rtl" class="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
    <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
      <div class="text-center space-y-3">
        <img
          :src="colorMode.value === 'dark' ? elgendyStore.logoDark : elgendyStore.logo"
          alt="EL-GENDY Mobile Store"
          class="h-14 mx-auto object-contain"
        />
        <div>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">لوحة تحكم المتجر</h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">سجّل الدخول لإدارة المنتجات والأقسام والصور</p>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block">اسم المستخدم</label>
          <div class="relative">
            <User class="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              v-model="username"
              type="text"
              required
              autocomplete="username"
              placeholder="elgendy"
              class="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block">كلمة المرور</label>
          <div class="relative">
            <Lock class="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••"
              class="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <p v-if="errorMsg" class="text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center">
          {{ errorMsg }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <LogIn v-else class="w-4 h-4" />
          <span>دخول للوحة التحكم</span>
        </button>
      </form>

      <div class="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-500 transition-colors">
          <ArrowRight class="w-3.5 h-3.5" />
          <span>العودة للمتجر</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

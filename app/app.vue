<script setup lang="ts">
const head = useLocaleHead({
  dir: true,
  lang: true
})

useHead(() => ({
  htmlAttrs: {
    lang: head.value.htmlAttrs?.lang,
    dir: head.value.htmlAttrs?.dir
  }
}))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    <NuxtPage />
    <CartDrawer />
    <PwaInstallButton />
    <FloatingActions />
    <ToastContainer />
  </div>
</template>

export const usePwaInstall = () => {
  const isInstalled = useState<boolean>('pwa-installed', () => false)
  const hasNativePrompt = useState<boolean>('pwa-native-prompt', () => false)
  const isIos = useState<boolean>('pwa-is-ios', () => false)
  const isDismissed = useState<boolean>('pwa-dismissed', () => false)
  const showIosGuide = useState<boolean>('pwa-ios-guide', () => false)
  const listenersAttached = useState<boolean>('pwa-listeners-attached', () => false)

  const checkIsStandalone = () => {
    if (!import.meta.client) return false
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    )
  }

  const checkIsIos = () => {
    if (!import.meta.client) return false
    const ua = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(ua)
  }

  const init = () => {
    if (!import.meta.client) return

    if (checkIsStandalone()) {
      isInstalled.value = true
      hasNativePrompt.value = false
      return
    }

    isInstalled.value = false
    isIos.value = checkIsIos()

    if ((window as any).__pwaInstallPrompt) {
      hasNativePrompt.value = true
    }

    if (!listenersAttached.value) {
      listenersAttached.value = true

      window.addEventListener('pwa-prompt-ready', () => {
        if ((window as any).__pwaInstallPrompt) {
          hasNativePrompt.value = true
        }
      })

      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault()
        ;(window as any).__pwaInstallPrompt = e
        hasNativePrompt.value = true
      })

      window.addEventListener('appinstalled', () => {
        isInstalled.value = true
        hasNativePrompt.value = false
        ;(window as any).__pwaInstallPrompt = null
      })
    }
  }

  const canShowButton = computed(() => {
    if (isInstalled.value || isDismissed.value) return false
    return hasNativePrompt.value || isIos.value
  })

  const triggerInstall = async () => {
    if (!import.meta.client) return

    const promptEvent = (window as any).__pwaInstallPrompt
    if (promptEvent) {
      try {
        await promptEvent.prompt()
        const choice = await promptEvent.userChoice
        if (choice?.outcome === 'accepted') {
          isInstalled.value = true
          hasNativePrompt.value = false
        }
        ;(window as any).__pwaInstallPrompt = null
        return
      } catch (err) {
        console.warn('Direct PWA install failed:', err)
      }
    }

    // Apple iOS Safari does not expose beforeinstallprompt, so show quick Share button guide
    if (isIos.value) {
      showIosGuide.value = true
    }
  }

  const dismiss = () => {
    isDismissed.value = true
  }

  return {
    canShowButton,
    isIos,
    showIosGuide,
    init,
    triggerInstall,
    dismiss
  }
}

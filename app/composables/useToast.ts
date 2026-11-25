export interface ToastItem {
  id: number
  message: string
  type: 'success' | 'info'
}

export function useToast() {
  const toasts = useState<ToastItem[]>('elgendy_toasts', () => [])

  const showToast = (message: string, type: 'success' | 'info' = 'success', duration = 2600) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    toasts.value.push({ id, message, type })
    if (import.meta.client) {
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, duration)
    }
  }

  return {
    toasts,
    showToast
  }
}

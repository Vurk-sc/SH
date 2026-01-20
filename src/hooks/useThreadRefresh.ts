import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useThreadRefresh = (refreshTrigger: number) => {
  const router = useRouter()

  useEffect(() => {
    if (refreshTrigger > 0) {
      router.refresh()
    }
  }, [refreshTrigger, router])
}

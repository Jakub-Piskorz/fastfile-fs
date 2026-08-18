import { Routes, useCurrentRoute } from '@/router/router'

export default function useUuid() {
  const currentRoute = useCurrentRoute()
  if (currentRoute !== Routes.download) return
  return location.pathname.split('/')[3]
}
import { routes, useCurrentRoute } from '@/router/router'

export default function useUuid() {
  const currentRoute = useCurrentRoute()
  if (currentRoute !== routes.link) return
  return location.pathname.split('/')[3]
}
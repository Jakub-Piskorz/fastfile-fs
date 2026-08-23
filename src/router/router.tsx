import App from '@/pages/App/App'
import { createBrowserRouter, useLocation } from 'react-router-dom'
import { requireAuthentication } from './redirect'
import Files from '@/pages/App/Files/Files'
import { basename } from '@/config'
import Loading from '@/pages/App/Files/Loading/Loading'

export type RouteValue = (typeof Routes)[keyof typeof Routes]
export const Routes = {
  landingPage: '/lp',
  app: '/',
  download: '/download',
  linkWithVariable: '/download/:uuid',
  register: '/register',
  shared: '/shared',
  sharedWithMe: '/shared-with-me',
  authError: '/auth-error'
} as const

export const getLink = (uuid: string) => `/download/${uuid}`

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: App,
      HydrateFallback: Loading,
      loader: requireAuthentication,
      children: [
        { path: '/', Component: Files },
        { path: '/*', Component: Files },
        { path: Routes.linkWithVariable, Component: Files },
        { path: Routes.shared, Component: Files },
        { path: Routes.sharedWithMe, Component: Files }
      ]
    },
    {
      path: Routes.landingPage,
      lazy: async () => ({
        Component: (await import('@/pages/LandingPage/LandingPage')).default
      })
    },
    {
      path: Routes.register,
      lazy: async () => ({
        Component: (await import('@/pages/LandingPage/Register/Register')).default
      })
    },
    {
      path: Routes.authError,
      lazy: async () => ({
        Component: (await import('@/pages/Error/AuthError')).default
      })
    },
    { path: '*', lazy: async () => ({ Component: (await import('@/pages/Error/PageNotFound')).default }) }
  ], { basename }
)

// Useful hook for checking what web page you're currently in.
export function useCurrentRoute(): RouteValue {
  const pathname = useLocation().pathname.split('/')[1]

  switch (true) {
    case pathname === '':
      return Routes.app
    case pathname === 'download':
      return Routes.download
    case pathname === 'shared':
      return Routes.shared
    case pathname === 'shared-with-me':
      return Routes.sharedWithMe
    default:
      return Routes.app
  }
}
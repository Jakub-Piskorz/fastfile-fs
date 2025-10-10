import App from '@/pages/App/App'
import LandingPage from '@/pages/LandingPage/LandingPage'
import Register from '@/pages/LandingPage/Register/Register'
import { createBrowserRouter, useLocation } from 'react-router-dom'
import { requireAuthentication } from './redirect'
import Files from '@/pages/App/Files/Files'
import { basename } from '@/config'
import PageNotFound from '@/pages/404/404'

export const routes = {
  landingPage: '/lp',
  app: '/',
  link: '/download',
  linkWithVariable: '/download/:uuid',
  getLink: (uuid: string) => `/download/${uuid}`,
  register: '/register',
  shared: '/shared'
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: App,
      loader: requireAuthentication,
      HydrateFallback: () => <div />,
      children: [
        { index: true, Component: Files },
        { path: routes.linkWithVariable, Component: Files },
        { path: routes.shared, Component: Files }
      ]
    },
    {
      path: routes.landingPage,
      Component: LandingPage
    },
    {
      path: routes.register,
      Component: Register
    },
    { path: '*', Component: PageNotFound }
  ], { basename }
)

// Useful hook for checking what web page you're currently in.
export function useCurrentRoute() {
  const pathname = useLocation().pathname.split('/')[1]
  switch (pathname) {
    case '':
      return routes.app
    case 'download':
      return routes.link
    case 'shared':
      return routes.shared
    default:
      return null
  }
}
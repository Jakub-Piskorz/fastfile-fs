import App from '@/pages/App/App'
import LandingPage from '@/pages/LandingPage/LandingPage'
import Register from '@/pages/LandingPage/Register/Register'
import { createBrowserRouter, useLocation } from 'react-router-dom'
import { requireAuthentication } from './redirect'
import Download from '@/pages/App/Download/Download'
import Files from '@/pages/App/Files/Files'
import API from '@/scripts/API'
import { basename } from '@/config'
import Shared from '@/pages/App/Shared/Shared'

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
      children: [
        { path: routes.app, Component: Files },
        {
          path: routes.linkWithVariable,
          Component: Download,
          loader: async ({ params }) => {
            const res = await API.lookupLink(params.uuid)
            if (res.ok) {
              return await res.json()
            }
            return null
          }
        },
        {
          path: routes.shared,
          Component: Shared,
          loader: Shared.loader
        }
      ]
    },
    {
      path: routes.landingPage,
      Component: LandingPage
    },
    {
      path: routes.register,
      Component: Register
    }
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
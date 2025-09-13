import App from '@/pages/App/App'
import LandingPage from '@/pages/LandingPage/LandingPage'
import Register from '@/pages/LandingPage/Register'
import { createBrowserRouter } from 'react-router-dom' // <-- fix here
import { requireAuthentication } from './redirect'
import Download from '@/pages/Download/Download'
import Files from '@/pages/Files/Files'
import API from '@/scripts/API'
import { basename } from '@/config'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: App,
      loader: requireAuthentication,
      children: [
        { path: '/', Component: Files },
        {
          path: '/download/:uuid',
          loader: async ({ params }) => {
            const res = await API.lookupLink(params.uuid)
            if (res.ok) {
              return await res.json()
            }
            return null
          },
          Component: Download
        }
      ]
    },
    {
      path: '/lp',
      Component: LandingPage
    },
    {
      path: '/register',
      Component: Register
    }
  ],
  {
    basename
  }
)

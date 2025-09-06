import App from '@/pages/App/App'
import LandingPage from '@/pages/LandingPage/LandingPage'
import Register from '@/pages/LandingPage/Register'
import { createBrowserRouter } from 'react-router-dom' // <-- fix here
import { requireAuthentication } from './redirect'

export const basename = '/fastfile/'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: App,
      loader: requireAuthentication,
    },
    {
      path: '/lp',
      Component: LandingPage,
    },
    {
      path: '/register',
      Component: Register,
    },
  ],
  {
    basename,
  }
)

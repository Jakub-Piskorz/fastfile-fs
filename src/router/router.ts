import App from '@/pages/App/App'
import LandingPage from '@/pages/LandingPage/LandingPage'
import Register from '@/pages/LandingPage/Register'
import { createBrowserRouter } from 'react-router'

export const basename = '/fastfile/'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: App,
    },
    {
      path: '/lp',
      Component: LandingPage,
      children: [],
    },
    {
      path: '/register',
      Component: Register,
      children: [],
    },
  ],
  { basename }
)

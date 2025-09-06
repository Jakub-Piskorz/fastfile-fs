import { createRoot } from 'react-dom/client'
import App from '@/pages/App/App'
import LandingPage from '@/pages/LandingPage/LandingPage'
import Register from '@/pages/LandingPage/Register'
import CookieScripts from '@/scripts/cookie-scripts'
import { router } from '@/router/router'
import { RouterProvider } from 'react-router-dom'

const root = createRoot(document.getElementById('app')!)

root.render(<RouterProvider router={router} />)

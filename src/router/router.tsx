import App from '@/pages/App/App'
import LandingPage from '@/pages/LandingPage/LandingPage'
import Register from '@/pages/LandingPage/Register'
import { createBrowserRouter } from 'react-router-dom'
import { requireAuthentication } from './redirect'
import Download from '@/pages/Download/Download'
import Files from '@/pages/Files/Files'
import API from '@/scripts/API'
import { basename } from '@/config'
import React, { Suspense } from 'react'

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
          Component: () => <Suspense fallback={<div>Loading...</div>}><Download /></Suspense>
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

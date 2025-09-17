import { createRoot } from 'react-dom/client'
import { router } from '@/router/router'
import { RouterProvider } from 'react-router-dom'
import '@/fonts/exo.css'

const root = createRoot(document.getElementById('app')!)

root.render(<RouterProvider router={router} />)

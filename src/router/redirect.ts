import CookieScripts from '@/scripts/cookie-scripts'
import { redirect } from 'react-router-dom'

export async function requireAuthentication() {
  const token = CookieScripts.get('token') as string | null
  if (!token) {
    throw redirect('/lp')
  }
  return null
}

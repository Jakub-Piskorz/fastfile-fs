import CookieScripts from '@/scripts/cookie-scripts'
import { redirect } from 'react-router-dom'
import API from '@/api/oldApi'
import { routes } from '@/router/router'

export interface IUserInfo {
  id: number
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  userType: 'free' | 'premium',
  usedStorage: number
}

export async function requireAuthentication(): Promise<IUserInfo> {
  const token = CookieScripts.get('token') as string | null
  if (!token) {
    throw redirect(routes.landingPage)
  }
  const response = await API.userInfo()
  if (!response.ok) throw redirect(routes.landingPage)
  return await response.json()
}

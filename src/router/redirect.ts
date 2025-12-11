import { redirect } from 'react-router-dom'
import { routes } from '@/router/router'
import Api, { getToken } from '@/api'

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
  if (!getToken()) {
    throw redirect(routes.landingPage)
  }
  const response = await Api.auth.getCurrentUser()
  if (!response.ok) throw redirect(routes.landingPage)
  return await response.json()
}

import { redirect } from 'react-router-dom'
import { routes } from '@/router/router'
import Api, { getToken, UserDTO } from '@/api'

export async function requireAuthentication() {
  if (!getToken()) {
    throw redirect(routes.landingPage)
  }
  const response = await Api.auth.getCurrentUser()
  if (response.status !== 200) throw redirect(routes.landingPage)
  return response.data
}

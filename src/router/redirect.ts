import { redirect } from 'react-router-dom'
import { Routes } from '@/router/router'
import Api, { getToken } from '@/api'

export async function requireAuthentication() {
  if (!getToken()) {
    throw redirect(Routes.landingPage)
  }
  const response = await Api.auth.getCurrentUser()
  if (response.status !== 200) throw redirect(Routes.landingPage)
  return response.data
}

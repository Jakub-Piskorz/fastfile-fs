import { redirect } from 'react-router-dom'
import { Routes } from '@/router/router'
import Api, { getToken } from '@/api'

export async function requireAuthentication() {
  if (!getToken()) {
    throw redirect(Routes.landingPage)
  }

  try {
    const response = await Api.auth.getCurrentUser()
    return response.data
  } catch (error: any) {
    console.error(error)
    if (error.response) throw redirect(Routes.landingPage)
    if (!error.response) throw redirect(Routes.authError)

  }
}

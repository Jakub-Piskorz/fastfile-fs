import CookieScripts from '@/scripts/cookie-scripts'
import { Api as SwaggerApi } from './Api'

export * from '@/api/Api'
export * from '@/api/utils'

export const getToken = (): string | undefined => CookieScripts.get('token')

export const swaggerApi = new SwaggerApi({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})
export default swaggerApi

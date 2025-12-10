import CookieScripts from '@/scripts/cookie-scripts'
import { Api as SwaggerApi } from './Api.ts'

export * from '@/api/Api.ts'
export * from '@/api/oldApi.js'
export * from '@/api/utils.ts'

export const swaggerApi = new SwaggerApi({
  baseApiParams: {
    headers: {
      Authorization: `Bearer ${CookieScripts.get('token')}`
    }
  }
})
export default swaggerApi

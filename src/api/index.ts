import CookieScripts from '@/scripts/cookie-scripts'
import { Api as SwaggerApi } from './Api'

export * from '@/api/Api'
export * from '@/api/utils'

export const getToken = (): string | undefined => CookieScripts.get('token')

// @ts-ignore Webpack knows what "process" is
const isDevServer = process.env.NODE_ENV === 'development'

export const swaggerApi = new SwaggerApi({
  headers: {
    Authorization: `Bearer ${getToken()}`
  },
  baseURL:
    isDevServer ? 'https://localhost:8080' : 'https://jakubpiskorz.dev:8080'
})

export default swaggerApi

// Functions for communication with FileSystem backend

import CookieScripts from './cookie-scripts'
import { routes, useCurrentRoute } from '@/router/router'

const BASE_URL = 'https://jakubpiskorz.dev:8080'

const authHeader = () => ({
  Authorization: `Bearer ${CookieScripts.get('token')}`
})
const typeJson = { 'Content-Type': 'application/json' }

const fetcher = fetch

const API = {
  listFiles: function(slug = ``, controller) {
    return fetcher(`${BASE_URL}/api/v1/files/list/${slug}`, {
      headers: {
        ...authHeader()
      },
      signal: controller?.signal
    })
  },
  upload: function(path = ``, file) {
    const formData = new FormData()
    formData.append('filePath', `/${path}`)
    formData.append('file', file)
    return fetcher(`${BASE_URL}/api/v1/files/upload`, {
      method: `POST`,
      body: formData,
      headers: {
        ...authHeader()
      }
    })
  },
  login: function(login = ``, password = ``) {
    return fetcher(`${BASE_URL}/auth/login`, {
      method: `POST`,
      body: JSON.stringify({ login, password }),
      headers: typeJson
    })
  },
  logout: async function() {
    return fetcher(`${BASE_URL}/auth/logout`, {
      method: `GET`,
      headers: authHeader()
    })
  },
  register: function(body) {
    return fetcher(`${BASE_URL}/auth/register`, {
      method: `POST`,
      body: JSON.stringify(body),
      headers: typeJson
    })
  },
  userInfo: function() {
    return fetcher(`${BASE_URL}/auth/user`, {
      method: `GET`,
      headers: authHeader()
    })
  },
  download: (filePaths = []) => {
    if (filePaths.length === 0) return
    let fetchCall
    let fileName
    if (filePaths.length === 1) {
      fetchCall = fetcher(
        `${BASE_URL}/api/v1/files/download/${filePaths[0]}`,
        {
          method: `GET`,
          headers: authHeader()
        }
      )
    } else {
      fetchCall = fetcher(
        `${BASE_URL}/api/v1/files/download-multiple`,
        {
          method: 'POST',
          body: JSON.stringify({
            filePaths
          }),
          headers: { ...authHeader(), ...typeJson }
        }
      )
    }
    return fetchCall
      .then((response) => {
        if (response === null || !response.ok)
          throw new Error(
            `Error code: ${response?.status}. File cannot be downloaded.`
          )

        // Extract file name from response header.
        fileName = response.headers
          .get('content-disposition')
          .match(/filename="?([^"]+)"?/i)[1]
        return response.blob()
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
  },
  delete: function(filePath = '') {
    return fetcher(
      `${BASE_URL}/api/v1/files/delete/${filePath}`,
      {
        method: 'DELETE',
        headers: authHeader()
      }
    )
  },
  search: function(fileName = '', directory = '', controller) {
    return fetcher(`${BASE_URL}/api/v1/files/search`, {
      method: 'POST',
      headers: { ...authHeader(), ...typeJson },
      body: JSON.stringify({
        fileName,
        directory
      }),
      signal: controller?.signal
    })
  },
  createDir: (path = ``) =>
    fetcher(
      `${BASE_URL}/api/v1/files/create-directory/${path}`,
      {
        headers: authHeader()
      }
    ),
  createPublicLink: (filePath) =>
    fetcher(`${BASE_URL}/api/v1/files/link/create`, {
      headers: authHeader(),
      method: 'POST',
      body: filePath
    }),
  createPrivateLink: (filePath, emails) =>
    fetcher(`${BASE_URL}/api/v1/files/link/create-private`, {
      headers: { ...authHeader(), ...typeJson },
      method: 'POST',
      body: JSON.stringify({
        filePath,
        emails
      })
    }),
  removeLink: (uuid) =>
    fetcher(`${BASE_URL}/api/v1/files/link/${uuid}`, {
      headers: { ...authHeader() },
      method: 'DELETE'
    }),
  lookupLink: (uuid) =>
    fetcher(`${BASE_URL}/api/v1/files/link/lookup/${uuid}`, {
      headers: authHeader()
    }),
  myLinks: () =>
    fetcher(`${BASE_URL}/api/v1/files/link/list`, {
      headers: authHeader()
    }),
  sharedToMe: () =>
    fetcher(`${BASE_URL}/api/v1/files/link/shared-to-me`, {
      headers: authHeader()
    }),
  downloadLink: (uuid) => {
    let fileName
    fetcher(`${BASE_URL}/api/v1/files/link/${uuid}`, {
      headers: authHeader()
    })
      .then((response) => {
        if (response === null || !response.ok)
          throw new Error(
            `Error code: ${response?.status}. File cannot be downloaded.`
          )

        // Extract file name from response header.
        fileName = response.headers
          .get('content-disposition')
          .match(/filename="?([^"]+)"?/i)[1]
        return response.blob()
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
  }
}

export const useListFilesApiCall = () => {
  let apiCall
  const currentRoute = useCurrentRoute()
  switch (currentRoute) {
    case routes.app:
      apiCall = API.listFiles
      break
    case routes.shared:
      apiCall = API.myLinks
      break
    case routes.sharedToMe:
      apiCall = API.sharedToMe
      break
    case routes.link:
      apiCall = API.lookupLink
      break
    default:
      apiCall = API.listFiles
  }
  return apiCall
}

export default API

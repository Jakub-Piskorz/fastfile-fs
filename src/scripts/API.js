// Functions for communication with FileSystem backend

import CookieScripts from './cookie-scripts'
import { routes, useCurrentRoute } from '@/router/router'

const BASE_URL = 'https://jakubpiskorz.dev:8080'

const authHeader = () => ({
  Authorization: `Bearer ${CookieScripts.get('token')}`
})


const API = {
  listFiles: function(slug = ``, controller) {
    return fetch(`${BASE_URL}/api/v1/files/list/${slug}`, {
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
    return fetch(`${BASE_URL}/api/v1/files/upload`, {
      method: `POST`,
      body: formData,
      headers: {
        ...authHeader()
      }
    })
  },
  login: function(login = ``, password = ``) {
    return fetch(`${BASE_URL}/auth/login`, {
      method: `POST`,
      body: JSON.stringify({ login, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  logout: async function() {
    return fetch(`${BASE_URL}/auth/logout`, {
      method: `GET`,
      headers: authHeader()
    })
  },
  register: function(body) {
    return fetch(`${BASE_URL}/auth/register`, {
      method: `POST`,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  userInfo: function() {
    return fetch(`${BASE_URL}/auth/user`, {
      method: `GET`,
      headers: authHeader()
    })
  },
  download: (filePaths = []) => {
    if (filePaths.length === 0) return
    let fetchCall
    let fileName
    if (filePaths.length === 1) {
      fetchCall = fetch(
        `${BASE_URL}/api/v1/files/download/${filePaths[0]}`,
        {
          method: `GET`,
          headers: authHeader()
        }
      )
    } else {
      fetchCall = fetch(
        `${BASE_URL}/api/v1/files/download-multiple`,
        {
          method: 'POST',
          body: JSON.stringify({
            filePaths
          }),
          headers: { ...authHeader(), 'Content-Type': 'application/json' }
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
    return fetch(
      `${BASE_URL}/api/v1/files/delete/${filePath}`,
      {
        method: 'DELETE',
        headers: authHeader()
      }
    )
  },
  search: function(fileName = '', directory = '', controller) {
    return fetch(`${BASE_URL}/api/v1/files/search`, {
      method: 'POST',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName,
        directory
      }),
      signal: controller?.signal
    })
  },
  createDir: (path = ``) =>
    fetch(
      `${BASE_URL}/api/v1/files/create-directory/${path}`,
      {
        headers: authHeader()
      }
    ),
  createPublicLink: (filePath) =>
    fetch(`${BASE_URL}/api/v1/files/link/create`, {
      headers: authHeader(),
      method: 'POST',
      body: filePath
    }),
  createPrivateLink: (filePath, emails) =>
    fetch(`${BASE_URL}/api/v1/files/link/create-private`, {
      headers: authHeader(),
      method: 'POST',
      body: JSON.stringify({
        filePath,
        emails
      })
    }),
  lookupLink: (uuid) =>
    fetch(`${BASE_URL}/api/v1/files/link/lookup/${uuid}`, {
      headers: authHeader()
    }),
  myLinks: () =>
    fetch(`${BASE_URL}/api/v1/files/link/list`, {
      headers: authHeader()
    }),
  downloadLink: (uuid) => {
    let fileName
    fetch(`${BASE_URL}/api/v1/files/link/${uuid}`, {
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
    case routes.link:
      apiCall = API.lookupLink
      break
    default:
      apiCall = API.listFiles
  }
  return apiCall
}

export default API

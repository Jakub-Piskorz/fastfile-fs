// Functions for communication with FileSystem backend
// API.read(), API.upload(), API.login(), API.userInfo()

import CookieScripts from './cookie-scripts'

const authHeader = () => ({
  Authorization: `Bearer ${CookieScripts.get('token')}`,
})

const API = {
  listFiles: function (slug = ``, controller) {
    return fetch(`https://jakubpiskorz.dev:8080/api/v1/files/list/${slug}`, {
      headers: {
        ...authHeader(),
      },
      signal: controller?.signal,
    })
  },
  upload: function (path = ``, file) {
    const formData = new FormData()
    formData.append('filePath', `/${path}`)
    formData.append('file', file)
    return fetch(`https://jakubpiskorz.dev:8080/api/v1/files/upload`, {
      method: `POST`,
      body: formData,
      headers: {
        ...authHeader(),
      },
    })
  },
  login: function (login = ``, password = ``) {
    return fetch(`https://jakubpiskorz.dev:8080/auth/login`, {
      method: `POST`,
      body: JSON.stringify({ login, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
  logout: async function () {
    return fetch(`https://jakubpiskorz.dev:8080/auth/logout`, {
      method: `GET`,
      headers: authHeader(),
    })
  },
  register: function (body) {
    return fetch(`https://jakubpiskorz.dev:8080/auth/register`, {
      method: `POST`,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
  userInfo: function () {
    return fetch(`https://jakubpiskorz.dev:8080/auth/user`, {
      method: `GET`,
      headers: authHeader(),
    })
  },
  download: (filePaths = []) => {
    if (filePaths.length === 0) return
    let fetchCall
    let fileName
    if (filePaths.length === 1) {
      fetchCall = fetch(
        `https://jakubpiskorz.dev:8080/api/v1/files/download/${filePaths[0]}`,
        {
          method: `GET`,
          headers: authHeader(),
        }
      )
    } else {
      fetchCall = fetch(
        `https://jakubpiskorz.dev:8080/api/v1/files/download-multiple`,
        {
          method: 'POST',
          body: JSON.stringify({
            filePaths,
          }),
          headers: { ...authHeader(), 'Content-Type': 'application/json' },
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
  delete: function (filePath = '') {
    return fetch(
      `https://jakubpiskorz.dev:8080/api/v1/files/delete/${filePath}`,
      {
        method: 'DELETE',
        headers: authHeader(),
      }
    )
  },
  search: function (fileName = '', directory = '', controller) {
    return fetch(`https://jakubpiskorz.dev:8080/api/v1/files/search`, {
      method: 'POST',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName,
        directory,
      }),
      signal: controller?.signal,
    })
  },
  createDir: (path = ``) =>
    fetch(
      `https://jakubpiskorz.dev:8080/api/v1/files/create-directory/${path}`,
      {
        headers: authHeader(),
      }
    ),
  sharedByMe: () =>
    fetch(`https://jakubpiskorz.dev:8080/api/v1/files/shared-by-me`, {
      headers: authHeader(),
    }),

  createPublicLink: (filePath) =>
    fetch(`https://jakubpiskorz.dev:8080/api/v1/files/link/create`, {
      headers: authHeader(),
      method: 'POST',
      body: filePath,
    }),
  createPrivateLink: (filePath, emails) =>
    fetch(`https://jakubpiskorz.dev:8080/api/v1/files/link/create`, {
      headers: authHeader(),
      method: 'POST',
      body: {
        filePath,
        emails,
      },
    }),
  lookupLink: (uuid) =>
    fetch(`https://jakubpiskorz.dev:8080/api/v1/files/link/lookup/${uuid}`, {
      headers: authHeader(),
    }),
  myLinks: () =>
    fetch(`https://jakubpiskorz.dev:8080/api/v1/files/link/list`, {
      headers: authHeader(),
    }),
  downloadLink: (uuid) => {
    let fileName
    fetch(`https://jakubpiskorz.dev:8080/api/v1/files/link/${uuid}`, {
      headers: authHeader(),
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
  },
}

export default API

// Functions for communication with FileSystem backend
// API.read(), API.upload(), API.login(), API.userInfo()

import CookieScripts from './cookie-scripts'

const API = {
  listFiles: async function (slug = ``) {
    const token = CookieScripts.value('token')
    return fetch(`https://jakubpiskorz.dev:8080/api/v1/files/list/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
  upload: async function (path = ``, file) {
    const token = CookieScripts.value('token')
    const formData = new FormData()
    formData.append('filePath', `/${path}`)
    formData.append('file', file)
    return fetch(`https://jakubpiskorz.dev:8080/api/v1/files/upload`, {
      method: `POST`,
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
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
  logout: async function (token = ``) {
    try {
      return !token
        ? 'no token'
        : await fetch(`https://jakubpiskorz.dev:8080/auth/logout`, {
            method: `GET`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .catch((err) => console.error(err))
            .then((response) =>
              response.ok
                ? response.json()
                : console.error('Logout failed. Code: ' + response.status)
            )
    } catch (error) {
      console.error(error)
    }
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
  userInfo: function (token = ``) {
    return fetch(`https://jakubpiskorz.dev:8080/auth/user`, {
      method: `GET`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
  download: async function (filePath = ``) {
    try {
      const token = CookieScripts.value('token')
      return !token
        ? 'no token'
        : fetch(
            `https://jakubpiskorz.dev:8080/api/v1/files/download/${filePath}`,
            {
              method: `GET`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((response) => {
              if (response === null || !response.ok)
                throw new Error(
                  `Error code: ${response.status}. File cannot be downloaded.`
                )
              return response.blob()
            })
            .then((blob) => {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = filePath
              document.body.appendChild(a)
              a.click()
              a.remove()
            })
    } catch (error) {
      console.error(error)
    }
  },
}

export default API

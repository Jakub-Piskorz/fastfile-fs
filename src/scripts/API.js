// Functions for communication with FileSystem backend
// API.read(), API.upload(), API.login(), API.userInfo()

const API = {
  read: async function (token = ``, slug = ``) {
    try {
      return !token
        ? `no token`
        : await fetch(
            `https://jakubpiskorz.dev:8080/api/v1/files/list/${slug}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .catch((err) => console.error(err))
            .then((response) => {
              return response.ok
                ? response.json()
                : console.error(`response ain't okay. ${response.json()}`)
            })
    } catch (error) {
      console.error(error)
    }
  },
  upload: async function (token = ``, path = ``, file) {
    try {
      const formData = new FormData()
      formData.append('filePath', `/${path}`)
      formData.append('file', file)
      return !token || !file
        ? `no user/file`
        : await fetch(`https://jakubpiskorz.dev:8080/api/v1/files/upload`, {
            method: `POST`,
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .catch((err) => console.error(err))
            .then((response) =>
              response.ok
                ? response.json()
                : console.error('Upload failed. Code: ' + response.status)
            )
    } catch (error) {
      console.error(error)
    }
  },
  login: async function (login = ``, password = ``) {
    return !login || !password
      ? `Wrong login or password`
      : await fetch(`https://jakubpiskorz.dev:8080/auth/login`, {
          method: `POST`,
          body: JSON.stringify({ login, password }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          if (!response.ok) throw new Error(response.text())
          return response.text()
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
              response.ok ? response.json() : console.error(response.json())
            )
    } catch (error) {
      console.error(error)
    }
  },
  userInfo: async function (token = ``) {
    try {
      return !token
        ? 'no token'
        : await fetch(`https://jakubpiskorz.dev:8080/auth/user`, {
            method: `GET`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .catch((err) => console.error(err))
            .then((response) =>
              response.ok ? response.json() : console.error(response.json())
            )
    } catch (error) {
      console.error(error)
    }
  },
  download: async function (token = ``, filePath = ``) {
    try {
      return !token
        ? 'no token'
        : await fetch(
            `https://jakubpiskorz.dev:8080/api/v1/files/download/${filePath}`,
            {
              method: `GET`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).catch((err) => console.error(err))
    } catch (error) {
      console.error(error)
    }
  },
}

export default API

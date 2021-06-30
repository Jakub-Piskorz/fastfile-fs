// Functions for communication with FileSystem backend
// API.read(), API.upload(), API.login(), API.userInfo()

const API = {
  read: async function (token = ``, slug = ``) {
    try {
      return !token
        ? `no token`
        : await fetch(`https://fastfile.deltastorm.pl/api/v1/folders/${slug}`, {
            headers: {
              Authorization: token,
            },
          })
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
  upload: async function (token = ``, path = ``, file = null) {
    try {
      const formData = new FormData()
      formData.append('path', `${path}`)
      formData.append('upload', file)
      return !token || !file
        ? `no user/file`
        : await fetch(`https://fastfile.deltastorm.pl/api/v1/files/${path}`, {
            method: `POST`,
            body: formData,
            headers: {
              Authorization: token,
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
  login: async function (login = ``, password = ``) {
    try {
      const formData = new FormData()
      formData.append(`login`, login)
      formData.append(`password`, password)
      return !login || !password
        ? `Wrong login or password`
        : await fetch(`https://fastfile.deltastorm.pl/api/v1/users/login`, {
            method: `POST`,
            body: formData,
          })
            .catch((err) => console.error(err))
            .then((response) =>
              response.ok ? response.json() : console.error(response.json())
            )
    } catch (error) {
      console.error(error)
    }
  },
  logout: async function (token = ``) {
    try {
      return !token
        ? 'no token'
        : await fetch(`https://fastfile.deltastorm.pl/api/v1/users/logout`, {
            method: `GET`,
            headers: {
              Authorization: token,
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
        : await fetch(`https://fastfile.deltastorm.pl/api/v1/users`, {
            method: `GET`,
            headers: {
              Authorization: token,
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
  download: async function (token = ``, slug = ``) {
    try {
      return !token
        ? 'no token'
        : await fetch(
            `https://fastfile.deltastorm.pl/api/v1/files/${slug}/download`,
            {
              method: `GET`,
              headers: {
                Authorization: token,
              },
            }
          ).catch((err) => console.error(err))
    } catch (error) {
      console.error(error)
    }
  },
}

export default API

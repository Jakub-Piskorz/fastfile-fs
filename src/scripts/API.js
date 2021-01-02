// Functions for communication with FileSystem backend
// API.read(), API.upload(), API.login(), API.userInfo()

const API = {
  read: async function (token = ``, slug = ``) {
    try {
      return !token
        ? `no token`
        : await fetch(`http://fastfile.deltastorm.pl/api/v1/folders/${slug}`, {
            headers: {
              Authorization: token,
            },
          }).then((response) =>
            response.ok
              ? response.json()
              : `response ain't okay. ${response.json()}`
          )
    } catch (error) {
      console.log(error)
    }
  },
  upload: function (token = ``, path = ``, file = null) {
    try {
      const formData = new FormData()
      formData.append('path', `${path}`)
      formData.append('upload', file)
      return !token || !file
        ? `no user/file`
        : fetch(`http://fastfile.deltastorm.pl/api/v1/files/${path}`, {
            method: `POST`,
            body: formData,
            headers: {
              Authorization: token,
            },
          }).then((response) =>
            response.ok ? response.json() : console.error(response.json())
          )
    } catch (error) {
      console.error(error)
    }
  },
  login: function (login = ``, password = ``) {
    try {
      const formData = new FormData()
      formData.append(`login`, login)
      formData.append(`password`, password)
      return !login || !password
        ? `Wrong login or password`
        : fetch(`http://fastfile.deltastorm.pl/api/v1/users/login`, {
            method: `POST`,
            body: formData,
          }).then((response) =>
            response.ok ? response.json() : console.log(response.json())
          )
    } catch (error) {
      console.error(error)
    }
  },
  logout: function (token = ``) {
    try {
      return !token
        ? 'no token'
        : fetch(`http://fastfile.deltastorm.pl/api/v1/users/logout`, {
            method: `GET`,
            headers: {
              Authorization: token,
            },
          }).then((response) =>
            response.ok ? response.json() : console.error(response.json())
          )
    } catch (error) {
      console.error(error)
    }
  },
  userInfo: function (token = ``) {
    try {
      return !token
        ? 'no token'
        : fetch(`http://fastfile.deltastorm.pl/api/v1/users`, {
            method: `GET`,
            headers: {
              Authorization: token,
            },
          }).then((response) =>
            response.ok ? response.json() : console.error(response.json())
          )
    } catch (error) {
      console.error(error)
    }
  },
}

export default API

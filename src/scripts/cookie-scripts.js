const CookieScripts = {
  cookies: function () {
    const _temp = document.cookie.split('; ')
    const _temp2 = _temp.map((pair) => pair.split('='))
    return _temp2.map((pair) => {
      let cookies = {}
      cookies[pair[0]] = pair[1]
      return cookies
    })
  },
  add: function (cookieName, value = '', expireDays = 0) {
    let expires = ''
    if (expireDays > 0) {
      const _expires = new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000)
      expires = `expires=${_expires.toGMTString()};`
    }
    if (cookieName) {
      const newCookie = `${cookieName}=${value};${expires}path=/`
      document.cookie = newCookie
    } else {
      console.error(`Cookie.add error: no name or value.`)
    }
  },
  value: function (name = '') {
    try {
      if (!name) return console.error(`No name in properties`)
      if (!this.cookies().find((pair) => pair.hasOwnProperty(name))) return null
      const value = this.cookies().find((pair) => pair.hasOwnProperty(name))[
        name
      ]
      return value
    } catch (error) {
      console.error(error)
    }
  },
}

export default CookieScripts

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
  add: function (name = '', value = '', expireDays = 0) {
    let expires = ''
    if (expireDays) {
      const _expires = new Date()
      _expires.setDate(_expires.getTime() + expireDays * 24 * 60 * 60 * 1000)
      expires = `expires=${_expires.toUTCString()};`
    }
    name
      ? (document.cookie = `${name}=${value};${expires ? expires : ''}`)
      : console.error(`Cookie.add error: no name or value.`)
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

const CookieScripts = {
  add: function (name = '', value = '', expireDays = 0) {
    let expires = ''
    if (expireDays) {
      const _expires = new Date()
      _expires.setDate(date.getTime() + expireDays * 24 * 60 * 60 * 1000)
      expires = `expires=${_expires.toUTCString()};`
    }
    name
      ? (document.cookie = `${name}=${value};${expires ? expires : ''}`)
      : console.error(`Cookie.add error: no name or value.`)
  },
  value: function (name = '') {
    try {
      if (!name) return console.error(`No name in properties`)
      const regexForValue = new RegExp(`(?<=${name}=)[^\;]+`)
      const value = document.cookie.match(regexForValue)
      return value ? value[0] : value
    } catch (error) {
      console.error(error)
    }
  },
}

export default CookieScripts

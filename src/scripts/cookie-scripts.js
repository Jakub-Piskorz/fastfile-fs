const CookieScripts = {
  add: function (name = '', value = '', expireDays = 0) {
    let expires = ''
    if (expireDays) {
      const _expires = new Date()
      _expires.setDate(date.getTime() + expireDays * 24 * 60 * 60 * 1000)
      expires = `expires=${_expires.toUTCString()}`
    }
    name || value
      ? (document.cookie = `${name}=${value};${
          expires ? expires + ';path=/' : ''
        }`)
      : console.error(`Cookie.add error: no name or value.`)
  },
}

export default CookieScripts

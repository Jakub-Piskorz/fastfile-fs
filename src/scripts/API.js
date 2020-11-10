const API = {
  read: function (user = ``, slug = ``) {
    try {
      return !user
        ? `no user`
        : fetch(
            `http://fastfile.deltastorm.pl/api/v1/files/${user}/${slug}`
          ).then((response) =>
            response.ok
              ? response.json()
              : `response ain't okay. ${resposne.json()}`
          )
    } catch (error) {
      console.log(error)
    }
  },
  upload: function (user = ``, slug = ``, file = null) {
    try {
      const formData = new FormData()
      formData.append('path', `${slug}`)
      formData.append('upload', file)
      return !user || !file
        ? `no user/file`
        : fetch(`http://fastfile.deltastorm.pl/api/v1/files/${user}/${slug}`, {
            method: `POST`,
            body: formData,
          }).then((response) =>
            response.ok ? response.json() : console.log(response.json())
          )
    } catch (error) {
      console.log(error)
    }
  },
}

export default API

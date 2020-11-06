const API = {
  read: function (user = ``, slug = ``) {
    try {
      return !user
        ? `no user`
        : fetch(
            `http://fastfile.deltastorm.pl/api/v1/files/${user}/${slug}`
          ).then((response) =>
            response.ok ? response.json() : `response ain't okay`
          )
    } catch (error) {
      console.log(error)
    }
  },
}

export default API

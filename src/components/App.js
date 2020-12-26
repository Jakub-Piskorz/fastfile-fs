import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Files from '@/components/Files'
import HtmlHead from '../scripts/HtmlHead'
import style from '@/style.module.scss'
import { useEffect, useState } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '../scripts/API'

const App = (props) => {
  const [username, setUsername] = useState('Loading')
  useEffect(() => {
    API.userInfo(CookieScripts.value('token'))
      .catch((response) => {
        CookieScripts.add('token', '')
        window.location.href = 'http://fastfile.jakubpiskorz.pl/'
      })
      .then((response) => {
        setUsername(response.data.login)
      })
  }, [])

  return (
    <>
      <HtmlHead title="Fastfile | Your files" />
      <Header />
      <main className={style.fs}>
        <Sidebar name={username} />
        <Files name={username} />
      </main>
    </>
  )
}

export default App

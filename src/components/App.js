import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Files from '@/components/Files'
import HtmlHead from '../scripts/HtmlHead'
import style from './App.module.scss'
import { useEffect, useState } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '../scripts/API'

const App = (props) => {
  const [username, setUsername] = useState('Loading')
  const [menuHook, setMenuHook] = useState(null)
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

  const changeMenuHook = (value) => {
    setMenuHook(value)
  }
  const hideMenu = () => {
    setMenuHook(null)
  }

  const stop = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <>
      <HtmlHead title="Fastfile | Your files" />
      <Header onMouseUp={hideMenu} onContextMenu={stop} />
      <main className={style.fs} onMouseUp={hideMenu} onContextMenu={stop}>
        <Sidebar name={username} />
        <Files
          name={username}
          changeMenuHook={changeMenuHook}
          menuHook={menuHook}
        />
      </main>
    </>
  )
}

export default App

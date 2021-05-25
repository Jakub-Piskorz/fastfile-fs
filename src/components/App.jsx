import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Files from '@/components/Files'
import HtmlHead from '../scripts/HtmlHead'
import style from './App.module.scss'
import { useEffect, useState } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '../scripts/API'
import CookieWarning from './CookieWarning'
import { ContextMenu } from '@/components/ContextMenu'

const App = (props) => {
  const [username, setUsername] = useState('Loading')
  const [menuHook, setMenuHook] = useState(null)
  const [menuState, setMenuState] = useState('closed')
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
    setDarkMode(CookieScripts.value("theme"))
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
  const hideMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuHook(null)
    setMenuState('closed')
  }

  const stop = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  return (
    <>
      <HtmlHead
        title="Fastfile | Your files"
        htmlAttrs={{
          theme: CookieScripts.value('theme')
            ? CookieScripts.value('theme')
            : 'light',
        }}
      />
      <CookieWarning />
      <Header
        menuState={menuState}
        setMenuState={setMenuState}
        hideMenu={hideMenu}
        onContextMenu={stop}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main className={style.fs} onContextMenu={stop} onClick={hideMenu}>
        <Sidebar name={username} />
        <Files
          name={username}
          setMenuHook={setMenuHook}
          menuState={menuState}
          setMenuState={setMenuState}
          menuHook={menuHook}
          setMenuHook={setMenuHook}
        />
        <ContextMenu
          menuHook={menuHook}
          menuState={menuState}
          setDarkMode={setDarkMode}
          darkMode={darkMode}
        />
      </main>
    </>
  )
}

export default App

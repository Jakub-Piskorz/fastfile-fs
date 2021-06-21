import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Files from '@/components/Files'
import HtmlHead from '../scripts/HtmlHead'
import style from '@/components/App.module.scss'
import {
  FunctionComponent,
  MouseEventHandler,
  ReactComponentElement,
  ReactElement,
  useEffect,
  useState,
} from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '../scripts/API'
import CookieWarning from './CookieWarning'
import { ContextMenu } from '@/components/ContextMenu'

const App = (props: any): ReactElement => {
  const [username, setUsername] = useState('Loading')
  const [menuHook, setMenuHook] = useState([])
  const [menuState, setMenuState] = useState('closed')
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
    setDarkMode(CookieScripts.value('theme'))
    API.userInfo(CookieScripts.value('token'))
      .catch((response: any) => {
        CookieScripts.add('token', '')
        window.location.href = 'http://fastfile.jakubpiskorz.pl/'
      })
      .then((response) => {
        setUsername(response.data.login)
      })
  }, [])

  const hideMenu = (e: React.MouseEvent<HTMLInputElement>) => {
    if (e === null) return
    e.preventDefault()
    e.stopPropagation()
    setMenuState('closed')
  }

  const stop = (e: React.MouseEvent<HTMLInputElement>) => {
    if (e === null) return
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
          menuHook={menuHook}
          menuState={menuState}
          setMenuState={setMenuState}
        />
      </main>
      <ContextMenu
        menuHook={menuHook}
        setMenuHook={setMenuHook}
        menuState={menuState}
        setMenuState={setMenuState}
        setDarkMode={setDarkMode}
        darkMode={darkMode}
      />
    </>
  )
}

export default App

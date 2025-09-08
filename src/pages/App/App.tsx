import Header from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import Files from '@/components/Files/Files'
import HtmlHead from '@/scripts/HtmlHead'
import style from './App.module.scss'
import { ReactElement, useEffect } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '@/scripts/API'
import CookieWarning from '@/components/cookie-popup/CookiePopup'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
import { MenuState, useStore } from '@/hooks/store'
import { basename } from '@/router/router'

const App = (): ReactElement => {
  const { setUsername, setMenuState, setDarkMode } = useStore()

  useEffect(() => {
    setDarkMode(CookieScripts.get('theme') === 'dark')

    const fetchUserInfo = async () => {
      const response = await API.userInfo()
      if (!response.ok) {
        CookieScripts.add('token', '')
        window.location.href = basename
        return
      }
      const resJson = await response.json()
      setUsername(resJson.username)
    }

    fetchUserInfo()
  }, [])

  const stop = (e: React.MouseEvent<HTMLInputElement>) => {
    if (e === null) return
    e.preventDefault()
    e.stopPropagation()
  }
  return (
    <div style={{ height: '100vh' }}>
      <HtmlHead
        title="Fastfile | Your files"
        htmlAttrs={{
          theme: CookieScripts.get('theme')
            ? CookieScripts.get('theme')
            : 'light',
        }}
      />
      <CookieWarning />
      <Header />
      <main className={style.fs} onClick={() => setMenuState(MenuState.closed)}>
        <Sidebar />
        <Files />
      </main>
      <ContextMenu />
    </div>
  )
}

export default App

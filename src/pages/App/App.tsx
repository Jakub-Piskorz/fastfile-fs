import Header from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import HtmlHead from '@/scripts/HtmlHead'
import style from './App.module.css'
import { ReactElement, useEffect } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '@/scripts/API'
import CookieWarning from '@/components/cookie-popup/CookiePopup'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
import { MenuState, useStore } from '@/hooks/store'
import { Outlet, redirect } from 'react-router-dom'

const App = (): ReactElement => {
  const { setUsername, setMenuState, setDarkMode, iconSize } = useStore()

  useEffect(() => {
    setDarkMode(CookieScripts.get('theme') === 'dark')

    const fetchUserInfo = () => {
      try {
        API.userInfo().then(async (response) => {
          if (!response.ok) {
            throw new Error('Wrong token')
          }
          const resJson = await response.json()
          setUsername(resJson.username)
        })
      } catch (e) {
        CookieScripts.add('token', '')
        redirect('/lp')
      }
    }

    fetchUserInfo()
  }, [])
  
  return (
    <div style={{ height: '100vh' }}>
      <HtmlHead
        title="Fastfile | Your files"
        htmlAttrs={{
          theme: CookieScripts.get('theme')
            ? CookieScripts.get('theme')
            : 'light'
        }}
      />
      <CookieWarning />
      <Header />
      <main
        className={style.fs}
        onClick={() => setMenuState(MenuState.closed)}
        icon-size={String(iconSize)}
      >
        <Sidebar />
        <Outlet />
      </main>
      <ContextMenu />
    </div>
  )
}

export default App

import Header from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import HtmlHead from '@/scripts/HtmlHead'
import style from './App.module.css'
import { ReactElement, useEffect } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import CookieWarning from '@/components/cookie-popup/CookiePopup'
import ContextMenu from '@/components/ContextMenu/ContextMenu'
import { useStore } from '@/hooks/store'
import { Outlet, useLoaderData } from 'react-router-dom'
import { IUserInfo } from '@/router/redirect'
import MenuState from '@/types/MenuStateEnum'

const App = (): ReactElement => {
  const { setMenuState, iconSize, setUsername } = useStore()
  const userInfo = useLoaderData<IUserInfo>()

  useEffect(() => {
    if (userInfo) setUsername(userInfo.username)
  }, [userInfo])

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

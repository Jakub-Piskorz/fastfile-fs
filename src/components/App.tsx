import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Files from '@/components/Files/Files'
import HtmlHead from '../scripts/HtmlHead'
import style from '@/components/App.module.scss'
import { ReactElement, useEffect } from 'react'
import CookieScripts from '@/scripts/cookie-scripts'
import API from '../scripts/API'
import CookieWarning from './cookie-popup/CookiePopup'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
import { useStore } from '@/hooks/store'
import { basename } from '..'

const App = (): ReactElement => {
  const { setUsername, setMenuState, setDarkMode } = useStore()

  useEffect(() => {
    setDarkMode(CookieScripts.value('theme') === 'dark')

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
      <Header />
      <main
        className={style.fs}
        onContextMenu={stop}
        onClick={() => setMenuState('closed')}
      >
        <Sidebar />
        <Files />
      </main>
      <ContextMenu />
    </>
  )
}

export default App

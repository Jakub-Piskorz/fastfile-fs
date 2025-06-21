import { DOMElement, ObjectHTMLAttributes, useEffect } from 'react'
import API from '@/scripts/API'
import style from './App.module.scss'
import CookieScripts from '@/scripts/cookie-scripts'
import DarkModeSwitch from './DarkModeSwitch'
import { useStore } from '@/hooks/store'

const ContextMenu = () => {
  const { clickedItem, menuState, setMenuState } = useStore()
  const stop = (e: React.MouseEvent) => e.preventDefault()
  const download = (e: React.MouseEvent) => {
    hideMenu()
    API.download(clickedItem)
  }
  const hideMenu = () => {
    setMenuState('closed')
  }
  const logout = (e: React.MouseEvent) => {
    API.logout(CookieScripts.value('token')).then((response) => {
      CookieScripts.add('token', '')
      window.location.href = 'https://fastfile.netlify.app'
    })
  }

  return (
    <div
      onContextMenu={stop}
      className={`${style.contextMenu} ${
        menuState === 'closed' ? style.hidden : ''
      }`}
    >
      <ul>
        {(() => {
          if (menuState === 'file')
            return <li onMouseUp={download}>Download</li>
          if (menuState === 'profile')
            return (
              <>
                <li>
                  <DarkModeSwitch />
                </li>
                <li onClick={hideMenu}>Profile settings</li>
                <li onClick={logout}>Log Out</li>
              </>
            )
          if (menuState === 'upload')
            return (
              <form>
                <input type="file" />
              </form>
            )
        })()}
      </ul>
    </div>
  )
}

export { ContextMenu }

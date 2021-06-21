import { DOMElement, ObjectHTMLAttributes, useEffect } from 'react'
import API from '@/scripts/API'
import style from './App.module.scss'
import CookieScripts from '@/scripts/cookie-scripts'
import DarkModeSwitch from './DarkModeSwitch'

const ContextMenu = ({
  menuHook,
  setMenuHook,
  menuState,
  setMenuState,
  darkMode,
  setDarkMode,
}: any) => {
  const stop = (e: React.MouseEvent) => e.preventDefault()
  const download = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    hideMenu()
    const _temp: string = menuHook[0].split('-')
    const fileName: string = _temp[0]
    const fileType: string = _temp[_temp.length - 1]
    API.download(CookieScripts.value('token'), menuHook[0])
      .then((response: any) => {
        if (response === null) return
        return response.blob()
      })
      .then((blob) => {
        var url = window.URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.href = url
        a.download = menuHook[0]
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((err) => {
        throw new Error(err)
      })
  }
  const changeDarkMode = (newValue: 'string') => setDarkMode(newValue)
  const hideMenu = () => {
    setMenuState('closed')
  }
  const logout = (e: React.MouseEvent) => {
    API.logout(CookieScripts.value('token')).then((response) => {
      CookieScripts.add('token', '')
      window.location.href = 'http://fastfile.jakubpiskorz.pl/'
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
                  <DarkModeSwitch
                    changeDarkMode={changeDarkMode}
                    darkMode={darkMode}
                  />
                </li>
                <li onClick={hideMenu}>Profile settings</li>
                <li onClick={logout}>Log Out</li>
              </>
            )
        })()}
      </ul>
    </div>
  )
}

export { ContextMenu }

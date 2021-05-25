import { useEffect } from 'react'
import API from '@/scripts/API'
import style from './App.module.scss'
import CookieScripts from '@/scripts/cookie-scripts'
import DarkModeSwitch from './DarkModeSwitch'

const menuAction = (action, info = null) => {
  const menu = document.querySelector(`.${style.contextMenu}`)
  if (action === 'close') menu.classList.add(style.hidden)
  else {
    menu.classList.remove(style.hidden)
    menu.style.top = `${Math.min(info.posY, window.innerHeight - 60)}px`
    menu.style.left = `${Math.min(info.posX, window.innerWidth - 120)}px`
  }
}

const ContextMenu = ({ menuHook, menuState, darkMode, setDarkMode }) => {
  const download = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const _temp = menuHook.split('-')
    const fileName = _temp[0]
    const fileType = _temp[_temp.length - 1]
    API.download(CookieScripts.value('token'), menuHook)
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob)
        var a = document.createElement('a')
        a.href = url
        a.download = menuHook
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
  }
  const changeDarkMode = (newValue) => setDarkMode(newValue)

  return (
    <div
      className={`${style.contextMenu} ${
        menuState === 'closed' ? style.hidden : 'dsds'
      }`}
    >
      <ul>
        {(() => {
          if (menuState === 'file')
            return <li onMouseUp={download}>Download</li>
          if (menuState === 'header')
            return (
              <>
                <li>
                  <DarkModeSwitch changeDarkMode={changeDarkMode} darkMode={darkMode} />
                </li>
                <li>Profile settings</li>
              </>
            )
        })()}
      </ul>
    </div>
  )
}

export { ContextMenu }

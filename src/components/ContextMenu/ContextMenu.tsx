import API from '@/scripts/API'
import style from './ContextMenu.module.css'
import CookieScripts from '@/scripts/cookie-scripts'
import DarkModeSwitch from '../DarkModeSwitch'
import { useStore } from '@/hooks/store'
import { basename } from '../..'
import { useRef } from 'react'

const ContextMenu = () => {
  const { clickedItem, menuState, setMenuState } = useStore()
  const uploadInputRef = useRef(null)
  const stop = (e: React.MouseEvent) => e.preventDefault()
  const download = (e: React.MouseEvent) => {
    hideMenu()
    API.download(clickedItem)
  }
  const hideMenu = () => {
    setMenuState('closed')
  }
  const logout = (e: React.MouseEvent) => {
    CookieScripts.add('token', '')
    window.location.href = basename
  }

  const onUpload = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(uploadInputRef)
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
                <label className={style.label} htmlFor={style.uploadInput}>
                  Upload file
                </label>
                <input
                  type="file"
                  ref={uploadInputRef}
                  id={style.uploadInput}
                />
                <button type="submit" onClick={onUpload}>
                  Upload
                </button>
              </form>
            )
        })()}
      </ul>
    </div>
  )
}

export { ContextMenu }

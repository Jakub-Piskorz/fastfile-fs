import API from '@/scripts/API'
import style from './ContextMenu.module.css'
import CookieScripts from '@/scripts/cookie-scripts'
import DarkModeSwitch from '../DarkModeSwitch'
import { StoreI, useStore } from '@/hooks/store'
import { basename } from '../..'
import { useEffect, useRef, useState } from 'react'

const ContextMenu = () => {
  const { clickedItem, menuState, setMenuState, setFiles } = useStore()
  const [uploadName, setUploadName] = useState('Select file')
  const uploadInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setUploadName('Select file')
  }, [menuState])

  const stop = (e: React.MouseEvent) => e.preventDefault()

  const onDownload = (e: React.MouseEvent) => {
    setMenuState('closed')
    API.download(clickedItem)
  }

  const onDelete = async (e: React.MouseEvent) => {
    setMenuState('closed')
    await API.delete(clickedItem)
    const files = await API.listFiles().then((res) =>
      res.ok ? res.json() : console.error('something went wrong')
    )
    setFiles(files)
  }

  const logout = (e: React.MouseEvent) => {
    CookieScripts.add('token', '')
    window.location.href = basename
  }

  const onUpload = (e: React.FormEvent) => {
    e.preventDefault()
    const input = uploadInputRef.current
    try {
      if (input && input.files && input.files[0]) {
        API.upload('', input.files[0] as FileList[0]).then(async () => {
          const files: StoreI['files'] = await API.listFiles().then(
            (res) => res.ok && res.json()
          )
          setFiles(files)
        })
      } else {
        throw new Error('No file on input')
      }
    } catch (e) {
      console.error(e)
    }
    setMenuState('closed')
  }

  return (
    <div
      onContextMenu={stop}
      style={{
        width: menuState === 'upload' ? '300px' : '170px',
      }}
      className={`${style.contextMenu} ${
        menuState === 'closed' ? style.hidden : ''
      }`}
    >
      <ul>
        {(() => {
          if (menuState === 'file')
            return (
              <>
                <li onMouseUp={onDownload}>Download</li>
                <li onMouseUp={onDelete}>Delete</li>
              </>
            )
          if (menuState === 'profile')
            return (
              <>
                <li>
                  <DarkModeSwitch />
                </li>
                <li onClick={() => setMenuState('closed')}>Profile settings</li>
                <li onClick={logout}>Log Out</li>
              </>
            )
          if (menuState === 'upload')
            return (
              <form>
                <label htmlFor={style.uploadInput}>{uploadName}</label>
                <input
                  type="file"
                  ref={uploadInputRef}
                  id={style.uploadInput}
                  onChange={(e: React.FormEvent) => {
                    const input = uploadInputRef.current
                    if (input && input.files && input.files[0]) {
                      setUploadName(input.files[0].name)
                    }
                  }}
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

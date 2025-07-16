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
  const createDirInputRef = useRef<HTMLInputElement>(null)
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

  const onNewDirBtn = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuState('newDir')
  }

  const onCreateNewFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    const dirName = createDirInputRef.current?.value
    if (!dirName) {
      setMenuState('closed')
      return
    }
    const success = await API.createDir(dirName).then((res) => res.ok && true)
    if (success) {
      API.listFiles()
        .then((res) => res.ok && res.json())
        .then((files) => {
          setFiles(files)
          setMenuState('closed')
        })
    }
  }

  return (
    <div
      onContextMenu={stop}
      style={{
        width: ['upload', 'newDir'].includes(menuState) ? '300px' : '170px',
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
          if (menuState === 'directory')
            return (
              <>
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
          if (menuState === 'background')
            return (
              <>
                <li onClick={onNewDirBtn}>Create new folder</li>
              </>
            )
          if (menuState === 'newDir')
            return (
              <form id={style.newDir} onSubmit={onCreateNewFolder}>
                <input
                  type="text"
                  placeholder="folder name"
                  ref={createDirInputRef}
                  autoFocus
                />
                <button type="submit">Create new folder</button>
              </form>
            )
          if (menuState === 'upload')
            return (
              <form id={style.upload}>
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

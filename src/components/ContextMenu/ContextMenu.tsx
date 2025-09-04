import API from '@/scripts/API'
import style from './ContextMenu.module.css'
import CookieScripts from '@/scripts/cookie-scripts'
import DarkModeSwitch from '../DarkModeSwitch/DarkModeSwitch'
import { MenuState, StoreI, useStore } from '@/hooks/store'
import { basename } from '../..'
import { useEffect, useRef, useState } from 'react'

const ContextMenu = () => {
  const {
    clickedItem,
    menuState,
    setMenuState,
    setFiles,
    contextMenuRef,
    setShareLink,
  } = useStore()
  const [uploadName, setUploadName] = useState('Select file')
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const createDirInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setUploadName('Select file')
  }, [menuState])

  const stop = (e: React.MouseEvent) => e.preventDefault()

  const onDownload = (e: React.MouseEvent) => {
    setMenuState(MenuState.closed)
    API.download([clickedItem])
  }

  const onDelete = async (e: React.MouseEvent) => {
    setMenuState(MenuState.closed)
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
    setMenuState(MenuState.closed)
  }

  const onNewDirBtn = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuState(MenuState.newDir)
  }

  const onCreateNewFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    const dirName = createDirInputRef.current?.value
    if (!dirName) {
      setMenuState(MenuState.closed)
      return
    }
    const success = await API.createDir(dirName).then((res) => res.ok && true)
    if (success) {
      API.listFiles()
        .then((res) => res.ok && res.json())
        .then((files) => {
          setFiles(files)
          setMenuState(MenuState.closed)
        })
    }
  }

  const onShare = async (e: React.MouseEvent) => {
    const link = await API.shareLink(clickedItem).then(
      (res) => res.ok && res.json()
    )
    if (link.uuid) {
      setMenuState(MenuState.copiedLink)
      navigator.clipboard.writeText(window.location + 'download/' + link.uuid) // TODO: Make this link work
    } else {
      setMenuState(MenuState.closed)
    }
  }

  return (
    <div
      ref={contextMenuRef}
      onContextMenu={stop}
      style={{
        width: [MenuState.upload, MenuState.newDir].includes(menuState)
          ? '300px'
          : '170px',
      }}
      className={`${style.contextMenu} ${
        menuState === MenuState.closed ? style.hidden : ''
      }`}
    >
      <ul>
        {(() => {
          if (menuState === MenuState.file)
            return (
              <>
                <li onMouseUp={onDownload}>Download</li>
                <li onMouseUp={onDelete}>Delete</li>
                <li onMouseUp={onShare}>Share</li>
              </>
            )
          if (menuState === MenuState.directory)
            return (
              <>
                <li onMouseUp={onDelete}>Delete</li>
              </>
            )
          if (menuState === MenuState.profile)
            return (
              <>
                <li>
                  <DarkModeSwitch />
                </li>
                <li onClick={() => MenuState.closed}>Profile settings</li>
                <li onClick={logout}>Log Out</li>
              </>
            )
          if (menuState === MenuState.background)
            return (
              <>
                <li onClick={onNewDirBtn}>Create new folder</li>
              </>
            )
          if (menuState === MenuState.newDir)
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
          if (menuState === MenuState.upload)
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
          if (menuState === MenuState.copiedLink)
            return <div className={style.normal}>Link copied!</div>
        })()}
      </ul>
    </div>
  )
}

export { ContextMenu }

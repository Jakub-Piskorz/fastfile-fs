import API from '@/scripts/API'
import style from './ContextMenu.module.css'
import CookieScripts from '@/scripts/cookie-scripts'
import DarkModeSwitch from '../DarkModeSwitch/DarkModeSwitch'
import arrowIcon from '@/images/arrow-top-right-on-square.svg'
import { MenuState, StoreI, useStore } from '@/hooks/store'
import { basename } from '@/config'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { routes } from '@/router/router'

const ContextMenu = () => {
  const { clickedItem, menuState, setMenuState, setFiles, contextMenuRef } =
    useStore()
  const location = useLocation()
  const [uploadName, setUploadName] = useState('Select file')
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [clipboard, setClipboard] = useState<string | null>(null)
  const createDirInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setUploadName('Select file')
  }, [menuState])

  const uuid = useMemo(() => {
    if (!/^\/download/.test(location.pathname)) return null
    return location.pathname.split('/')[2]
  }, [location])

  const stop = (e: React.MouseEvent) => e.preventDefault()

  const onDownload = () => {
    setMenuState(MenuState.closed)
    if (uuid) {
      API.downloadLink(uuid)
    } else {
      API.download([clickedItem])
    }
  }

  const onDelete = async () => {
    setMenuState(MenuState.closed)
    await API.delete(clickedItem)
    const files = await API.listFiles().then((res) =>
      res.ok ? res.json() : console.error('something went wrong')
    )
    setFiles(files)
  }

  const logout = () => {
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
        new Error('No file on input')
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

  const onShare = () => {
    setMenuState(MenuState.shareChoice)
  }

  const onPublicShare = async () => {
    setClipboard(null)
    const link: { uuid: string } = await API.createPublicLink(clickedItem).then(
      (res) => {
        if (!res.ok) {
          throw new Error('Link couldn\'t be created. Error code: ' + res.status + ', ' + res.statusText)
        }
        return res.json()
      }
    )
    if (link.uuid) {
      setMenuState(MenuState.publicShare)
      setClipboard(window.location.origin + basename + routes.getLink(link.uuid).slice(1))
      if (clipboard != null) {
        await navigator.clipboard.writeText(clipboard)
      }
    } else {
      setMenuState(MenuState.closed)
    }
  }

  const onPrivateShare = async () => {
    setClipboard(null)
    setMenuState(MenuState.privateShare)
  }

  return (
    <div
      ref={contextMenuRef}
      onContextMenu={stop}
      style={{
        width: [MenuState.upload, MenuState.newDir].includes(menuState)
          ? '300px'
          : '170px'
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
                  onChange={() => {
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
          if (menuState === MenuState.shareChoice)
            return <>
              <li onMouseUp={onPublicShare}>Create public link</li>
              <li onMouseUp={onPrivateShare}>Share to someone</li>
            </>
          if (menuState === MenuState.publicShare)
            return <a href={clipboard as string} className={style.normal}>
              <div>Link copied to clipboard</div>
              <img src={arrowIcon} alt="Go to link"></img>
            </a>
          if (menuState === MenuState.privateShare)
            return <div className={style.normal}>TODO: Do this</div>
        })()}
      </ul>
    </div>
  )
}

export { ContextMenu }

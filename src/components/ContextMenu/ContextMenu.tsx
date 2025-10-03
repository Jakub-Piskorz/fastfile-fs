import API, { useListFilesApiCall } from '@/scripts/API'
import style from './ContextMenu.module.css'
import CookieScripts from '@/scripts/cookie-scripts'
import DarkModeSwitch from '../DarkModeSwitch/DarkModeSwitch'
import arrowIcon from '@/images/arrow-top-right-on-square.svg'
import plusCircleIcon from '@/images/plus-circle.svg'
import uploadIcon from '@/images/upload.svg'
import { MenuState, StoreI, useStore } from '@/hooks/store'
import { basename } from '@/config'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { routes, useCurrentRoute } from '@/router/router'
import BeanOption from '@/components/BeanOption/BeanOption'

const ContextMenu = () => {
  const {
    clickedItem,
    menuState,
    setMenuState,
    setFiles,
    contextMenuRef,
    contextMenuPosition,
    setContextMenuPosition
  } =
    useStore()
  const apiCall = useListFilesApiCall()
  const location = useLocation()
  const currentRoute = useCurrentRoute()
  const navigate = useNavigate()
  const [uploadName, setUploadName] = useState('Select file')

  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [clipboard, setClipboard] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const createDirInputRef = useRef<HTMLInputElement>(null)
  const mailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUploadName('Select file')
    setMailList(new Set([]))
    setError(null)
  }, [menuState])

  useEffect(() => {
    if ([MenuState.upload, MenuState.newDir].includes(menuState)) {
      setContextMenuPosition({ ...contextMenuPosition, width: 300 })
    } else if ([MenuState.privateShare].includes(menuState)) {
      setContextMenuPosition({ ...contextMenuPosition, width: 400 })
    } else {
      setContextMenuPosition({ ...contextMenuPosition, width: 170 })
    }
  }, [menuState])

  const [mailList, setMailList] = useState<Set<string>>(new Set([]))

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

    // If we're on link page, deleting file also deletes the link, therefore return to main page
    if (currentRoute === routes.link) {
      navigate(routes.app)
      return
    }
    let files = await apiCall().then((res) =>
      res.ok ? res.json() : console.error('something went wrong')
    )
    if (!Array.isArray(files)) {
      files = [files]
    }
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

  const createLinkAndCopy = async (uuid?: string) => {
    if (uuid) {
      setMenuState(MenuState.publicShare)
      setClipboard(window.location.origin + basename + routes.getLink(uuid).slice(1))
      if (clipboard != null) {
        await navigator.clipboard.writeText(clipboard)
      }
    } else {
      setMenuState(MenuState.closed)
    }
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
    await createLinkAndCopy(link.uuid)
  }

  const onPrivateShare = async () => {
    setClipboard(null)
    setMenuState(MenuState.privateShare)
  }

  const onPrivateShareFinish = async () => {
    setClipboard(null)
    const link: { uuid: string } = await API.createPrivateLink(clickedItem, Array.from(mailList)).then(
      (res) => {
        if (!res.ok) {
          throw new Error('Link couldn\'t be created. Error code: ' + res.status + ', ' + res.statusText)
        }
        return res.json()
      }
    )
    await createLinkAndCopy(link.uuid)
  }

  return (
    <div
      ref={contextMenuRef}
      onContextMenu={stop}
      style={{
        width: contextMenuPosition.width + 'px',
        left: `${Math.min(contextMenuPosition.left, window.innerWidth - contextMenuPosition.width - 20)}px`,
        top: `${Math.min(contextMenuPosition.top, window.innerHeight - 70)}px`
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
            return <div className={style.privateLinkContainer}>
              <div className={style.title}>Share link to e-mails</div>
              {mailList.size > 0 && <div className={style.beanContainer}>
                {Array.from(mailList, (mail) =>
                  <BeanOption name={mail} key={mail} onDelete={() => {
                    setMailList(_mailList => {
                      _mailList.delete(mail)
                      setError(null)
                      return new Set(_mailList)
                    })
                  }} />)}
              </div>}
              <div className={style.inputContainer}>
                <input type="text" placeholder="enter e-mail" ref={mailRef} />
                <img tabIndex={0} role="button" alt="add e-mail" src={plusCircleIcon} className={style.addButton}
                     onClick={() => {
                       if (!mailRef.current) return
                       const value = mailRef.current.value
                       const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
                       if (!emailRegex.test(value)) {
                         setError('Please enter a valid email address')
                         return
                       }
                       setError(null)
                       setMailList((mails) => new Set([...Array.from(mails), value]))
                       mailRef.current.value = ''
                     }} />
                <img tabIndex={0} role="button" className={style.sendButton} alt="Create link" src={uploadIcon}
                     onClick={onPrivateShareFinish} />
              </div>
              {error && <div style={{ color: 'var(--red)', marginTop: '-10px' }}>{error}</div>}
            </div>
        })()}
      </ul>
    </div>
  )
}

export default ContextMenu

import Api, { FileDTO, useListFilesApiCall } from '@/api'
import style from './ContextMenu.module.css'
import CookieScripts from '@/scripts/cookie-scripts'
import DarkModeSwitch from '../DarkModeSwitch/DarkModeSwitch'
import arrowIcon from '@/images/arrow-top-right-on-square.svg'
import plusCircleIcon from '@/images/plus-circle.svg'
import uploadIcon from '@/images/upload.svg'
import { StoreI, useStore } from '@/hooks/store'
import { basename } from '@/config'
import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom'
import { routes, useCurrentRoute } from '@/router/router'
import BeanOption from '@/components/BeanOption/BeanOption'
import MenuState from '@/types/MenuStateEnum'
import { joinPaths } from '@/scripts/utils'
import OverlayState from '@/components/Overlay/OverlayStateEnum'
import { useOverlayStore } from '@/components/Overlay/overlayStore'

const ContextMenu = () => {
  const {
    clickedItem,
    menuState,
    setMenuState,
    setFiles,
    contextMenuRef,
    contextMenuPosition,
    setContextMenuPosition
  } = useStore()
  const { setOverlay } = useOverlayStore()
  const user = useLoaderData()
  const apiCall = useListFilesApiCall()
  const location = useLocation()
  const currentRoute = useCurrentRoute()
  const navigate = useNavigate()
  const { askOverlay } = useOverlayStore()
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

  // Setting menu width depending on menu type
  useEffect(() => {
    if ([MenuState.upload, MenuState.newDir].includes(menuState)) {
      setContextMenuPosition({ ...contextMenuPosition, width: 300 })
    } else if ([MenuState.privateShare].includes(menuState)) {
      setContextMenuPosition({ ...contextMenuPosition, width: 400 })
    } else if ([MenuState.directory].includes(menuState)) {
      setContextMenuPosition({ ...contextMenuPosition, width: 240 })
    } else {
      setContextMenuPosition({ ...contextMenuPosition, width: 170 })
    }
  }, [menuState])

  const contextMenuStyle: CSSProperties = useMemo(() => {
    const style: CSSProperties = {}
    const paddingH = 20
    const paddingV = 70
    const menuWidth = contextMenuPosition.width!
    const menuHeight = contextMenuRef?.current?.getBoundingClientRect().height ?? 0

    let key: keyof typeof contextMenuPosition

    for (key in contextMenuPosition) {
      let value = contextMenuPosition[key]!

      switch (key) {
        case 'left':
        case 'right':
          value = Math.min(value, window.innerWidth - menuWidth - paddingH)
          value = Math.max(value, paddingH)
          break
        case 'top':
        case 'bottom':
          value = Math.min(value, window.innerHeight - menuHeight - paddingV)
          value = Math.max(value, paddingV)
          break
      }

      style[key] = value
    }

    return style
  }, [contextMenuPosition, contextMenuRef?.current])

  const [mailList, setMailList] = useState<Set<string>>(new Set([]))

  const uuid = useMemo(() => {
    if (!/^\/download/.test(location.pathname)) return null
    return location.pathname.split('/')[2]
  }, [location])

  const stop = (e: React.MouseEvent) => e.preventDefault()

  const onDownload = () => {
    setMenuState(MenuState.closed)
    if (uuid) {
      Api.api.downloadFileFromLink(uuid)
    } else {
      Api.api.downloadFile(joinPaths(location.pathname, clickedItem?.metadata?.name))
    }
  }

  const onDelete = async () => {
    // Show warning, if folder contains files
    if (clickedItem?.metadata?.hasFiles) {
      setOverlay(OverlayState.deleteWarning)
      return
    }

    setMenuState(MenuState.closed)
    await Api.api.removeFile(joinPaths(location.pathname, clickedItem!.metadata!.name))

    // If we're on link page, deleting file also deletes the link, therefore return to main page
    if (currentRoute === routes.download) {
      navigate(routes.app)
      return
    }
    let files = await apiCall(joinPaths(location.pathname)).then((res) =>
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

  const deleteAccount = async () => {
    const wantsToDelete = await askOverlay(OverlayState.deleteAccountWarning)
    if (!wantsToDelete) return
    const accountDeleted = await Api.auth.deleteMe()
    if (accountDeleted) {
      CookieScripts.add('token', '')
      window.location.href = basename
    }
  }

  const onUpload = (e: React.FormEvent) => {
    e.preventDefault()

    const input = uploadInputRef.current
    try {
      if (input?.files && input.files[0]) {
        Api.api.uploadFile({
          filePath: '/' + joinPaths(location.pathname.slice(1)),
          file: input.files[0]
        })
          .then(async () => {
            const files = await Api.api.filesInDirectory(joinPaths(location.pathname)).then(
              (res: any) => res.ok && res.json()
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

    const success = await Api.api.createDirectory(joinPaths(location.pathname, dirName)).then((res: Response) => res.ok && true)
    if (success) {
      Api.api.filesInDirectory(joinPaths(location.pathname))
        .then((res: Response) => res.ok && res.json())
        .then((files: FileDTO[]) => {
          setFiles(files)
          setMenuState(MenuState.closed)
        })
    }
  }

  const onShare = () => {
    setMenuState(MenuState.shareChoice)
  }

  const urlFromUUID = (uuid?: string) => {
    if (!uuid) {
      throw new Error('UUID is required')
    }
    return routes.getLink(uuid).slice(1)
  }

  const createLinkAndCopy = async (uuid?: string) => {
    if (uuid) {
      const response: Response = await apiCall(joinPaths(location.pathname))
      if (!response.ok) {
        setMenuState(MenuState.closed)
        throw new Error(response.statusText)
      }
      const files = await response.json() as StoreI['files']
      setFiles(files)
      setMenuState(MenuState.publicShare)
      setClipboard(urlFromUUID(uuid))
      if (clipboard != null) {
        await navigator.clipboard.writeText(clipboard)
      }
    } else {
      setMenuState(MenuState.closed)
    }
  }

  const onPublicShare = async () => {
    setClipboard(null)
    const link: { uuid: string } = await Api.api.shareFileLink(clickedItem!.metadata.path!).then(
      (res: Response) => {
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
    const link: { uuid: string } = await Api.api.sharePrivateFileLink({
      filePath: clickedItem?.metadata.path,
      emails: Array.from(mailList)
    }).then(
      (res: Response) => {
        if (!res.ok) {
          throw new Error('Link couldn\'t be created. Error code: ' + res.status + ', ' + res.statusText)
        }
        return res.json()
      }
    )
    await createLinkAndCopy(link.uuid)
  }

  const onRemoveLink = async () => {
    setMenuState(MenuState.closed)
    if (!clickedItem) {
      throw new Error('Something wrong with clicked item.')
    }
    const response = await Api.api.removeFileLink(clickedItem.fileLink?.uuid!)
    if (!response.ok) {
      throw new Error('Link couldn\'t be removed.')
    }

    // If we're on link page, and link is removed, return to main page.
    if (currentRoute === routes.download) {
      navigate(routes.app)
      return
    }

    let files = await apiCall(joinPaths(location.pathname)).then((res) =>
      res.ok ? res.json() : console.error('something went wrong')
    )
    setFiles(files)
  }

  const onGoToLink = () => {
    setMenuState(MenuState.closed)
    const linkUrl = urlFromUUID(clickedItem!.fileLink!.uuid)
    navigate(linkUrl)
  }

  const ShareOptions = () => {
    const { clickedItem } = useStore()
    if (!clickedItem) return <></>
    if (clickedItem.fileLink?.uuid) {
      return <>
        <li onMouseUp={onGoToLink}>Go to link</li>
        {clickedItem.fileLink.ownerId === user.id &&
          <li onMouseUp={onRemoveLink}>Remove link</li>}
      </>
    } else {
      return <>
        <li onMouseUp={onShare}>Share</li>
      </>
    }
  }


  return (
    <div
      ref={contextMenuRef}
      onContextMenu={stop}
      style={contextMenuStyle}
      className={`${style.contextMenu} ${
        menuState === MenuState.closed ? style.hidden : ''
      }`}
    >
      <ul>
        {(() => {
          if (menuState === MenuState.file || menuState === MenuState.fileLink)
            return (
              <>
                <li onMouseUp={onDownload}>Download</li>
                <li onMouseUp={onDelete}>Delete file</li>
                <ShareOptions />
              </>
            )
          if (menuState === MenuState.fileLinkGuest)
            return (
              <>
                <li onMouseUp={onDownload}>Download</li>
                <li onMouseUp={onDelete}>Delete file</li>
                <li onMouseUp={onGoToLink}>Go to link</li>
              </>
            )
          if (menuState === MenuState.directory)
            return (
              <>
                <li
                  onMouseUp={onDelete}>{clickedItem?.metadata?.hasFiles ? 'Delete folder and files inside' : 'Delete folder'}</li>
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
                <li style={{ color: 'var(--red)' }} onClick={deleteAccount}>Delete account</li>
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
                       if (value === user.email) {
                         setError('You can\'t enter your own email address')
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

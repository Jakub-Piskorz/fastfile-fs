import style from './FilesButtonsUI.module.css'
import contextMenuStyle from '../ContextMenu/ContextMenu.module.css'
import downloadIcon from '@/images/download.svg'
import uploadIcon from '@/images/upload.svg'
import deleteIcon from '@/images/trash.svg'
import plusIcon from '@/images/plus.svg'
import minusIcon from '@/images/minus.svg'
import { MouseEvent, useEffect } from 'react'
import API, { useListFilesApiCall } from '@/actions/API'
import { useStore } from '@/hooks/store'
import { routes, useCurrentRoute } from '@/router/router'
import useUuid from '@/hooks/useUuid'
import { useLocation, useNavigate } from 'react-router-dom'
import MenuState from '@/types/MenuStateEnum'
import { joinPaths } from '@/scripts/utils'
import OverlayState from '@/types/OverlayStateEnum'

const FilesButtonsUI = () => {
  const {
    selectedFiles,
    setSelectedFiles,
    menuState,
    setMenuState,
    setFiles,
    iconSize,
    setIconSize,
    setOverlay
  } = useStore()


  const currentRoute = useCurrentRoute()
  const navigate = useNavigate()
  const location = useLocation()
  const apiCall = useListFilesApiCall()
  const uuid = useUuid()

  useEffect(() => {
    localStorage.setItem('icon-size', String(iconSize))
  }, [iconSize])

  useEffect(() => {
  }, [selectedFiles.length])

  const onUpload = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const contextMenu: HTMLElement | null = document.querySelector(
      `.${contextMenuStyle.contextMenu}`
    )
    if (menuState === MenuState.upload) {
      setMenuState(MenuState.closed)
      contextMenu?.classList.add(style.hidden)
      return
    }
    if (contextMenu === null) {
      console.error(`DOM call for context menu returned null.`)
      return
    }
    if (menuState === MenuState.closed) {
      contextMenu?.classList.remove(style.hidden)
      contextMenu.style.top = `115px`
      contextMenu.style.left = ``
      contextMenu.style.right = `42px`
      setMenuState(MenuState.upload)
    }
  }

  const onDelete = async () => {
    for (const item of selectedFiles) {
      if (item.metadata.hasFiles) {
        setOverlay(OverlayState.deleteWarning)
      } else {
        await API.delete(joinPaths(location.pathname, item.metadata.name))
      }
    }

    let files = await apiCall(joinPaths(uuid || joinPaths(location.pathname))).then((res) =>
      res.ok ? res.json() : console.error('something went wrong')
    )

    // If we're on link page, deleting file also deletes the link, therefore return to main page
    if (currentRoute === routes.download) {
      navigate(routes.app)
    }
    if (!Array.isArray(files)) {
      files = [files]
    }
    setFiles(files)
    setSelectedFiles([])
  }
  const onDownload = async () => {
    await API.download(selectedFiles.map(file => joinPaths(location.pathname, file.metadata.name)))
    setSelectedFiles([])
  }

  return (
    <div className={style.ui}>
      <button
        className={`${selectedFiles.length === 0 ? style.hidden : ''}`}
        onClick={onDelete}
      >
        <img src={deleteIcon} alt="Delete icon" />
      </button>
      <button
        className={`${selectedFiles.length === 0 ? style.hidden : ''}`}
        onClick={onDownload}
      >
        <img src={downloadIcon} alt="Download icon" />
      </button>
      <button onClick={onUpload}>
        <img src={uploadIcon} alt="Upload icon" />
      </button>
      <button
        className={`mobile-hidden ${iconSize === 5 && style.disabled}`}
        onClick={() => {
          setIconSize(Math.min(5, iconSize + 1) as typeof iconSize)
        }}
      >
        <img src={plusIcon} alt="Plus icon" />
      </button>
      <button
        className={`mobile-hidden ${iconSize === 1 && style.disabled}`}
        onClick={() => {
          setIconSize(Math.max(1, iconSize - 1) as typeof iconSize)
        }}
      >
        <img alt="minus icon" src={minusIcon} />
      </button>
    </div>
  )
}

export default FilesButtonsUI
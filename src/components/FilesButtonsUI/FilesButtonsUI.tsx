import style from './FilesButtonsUI.module.css'
import contextMenuStyle from '../ContextMenu/ContextMenu.module.css'
import downloadIcon from '@/images/download.svg'
import uploadIcon from '@/images/upload.svg'
import deleteIcon from '@/images/trash.svg'
import plusIcon from '@/images/plus.svg'
import minusIcon from '@/images/minus.svg'
import { MouseEvent, useEffect } from 'react'
import Api, { download, useListFilesApiCall } from '@/api'
import { useStore } from '@/hooks/store'
import { routes, useCurrentRoute } from '@/router/router'
import useUuid from '@/hooks/useUuid'
import { useLocation, useNavigate } from 'react-router-dom'
import MenuState from '@/types/MenuStateEnum'
import { joinPaths, normalizeFiles } from '@/scripts/utils'
import OverlayState from '@/components/Overlay/OverlayStateEnum'
import { useOverlayStore } from '@/components/Overlay/overlayStore'

const FilesButtonsUI = () => {
  const {
    selectedFiles,
    setSelectedFiles,
    menuState,
    setMenuState,
    setFiles,
    iconSize,
    setIconSize
  } = useStore()
  const { askOverlay } = useOverlayStore()


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
    for (const selectedFile of selectedFiles) {
      if (selectedFile.metadata.hasFiles) {
        await askOverlay(OverlayState.deleteWarning, selectedFile)
      } else {
        await Api.api.removeFile(joinPaths(location.pathname, selectedFile.metadata.name))
      }
    }

    let response = await apiCall(joinPaths(uuid || joinPaths(location.pathname)))
    if (response.status !== 200) {
      throw new Error('something went wrong')
    }
    let files = normalizeFiles(response.data)

    // If we're on link page, deleting file also deletes the link, therefore return to main page
    if (currentRoute === routes.download) {
      navigate(routes.app)
    }

    setFiles(files)
    setSelectedFiles([])
  }
  const onDownload = async () => {
    if (selectedFiles.length === 0) return
    const filePaths = selectedFiles.map(file => joinPaths(location.pathname, file.metadata.name))
    await download(filePaths)
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
import { DragEvent, useEffect, MouseEvent, useMemo, useRef } from 'react'
import API from '@/scripts/API.js'
import File from '../../components/File/File'
import FilesButtonsUI from '../../components/FilesButtonsUI/FilesButtonsUI'
import folderBlackIcon from '@/images/folder-black.svg'
import searchIcon from '@/images/search-black.svg'
import style from './Files.module.scss'
import { MenuState, OverlayState, useStore } from '@/hooks/store'
import Overlay from '../../components/Overlay/Overlay'
import useFileClick from '@/hooks/useFileClick'

const Files = () => {
  const {
    setMenuState,
    username,
    files,
    setFiles,
    searchedFiles,
    setOverlay,
    overlay,
    moduleSelected
  } = useStore()
  const fileClick = useFileClick()

  const currentFiles = useMemo(
    () => searchedFiles || files,
    [files?.length, searchedFiles?.length]
  )

  const title = useMemo(() => {
    switch (moduleSelected) {
      case 0:
        return username
      case 1:
        return 'Shared files'
      default:
        return username
    }
  }, [moduleSelected, username])

  const refresh = async () => {
    let apiCall
    switch (moduleSelected) {
      case 0:
        apiCall = API.listFiles
        break
      case 1:
        apiCall = API.sharedByMe
        break
      default:
        apiCall = API.listFiles
    }
    try {
      const files = await apiCall().then((response) => {
        if (response.ok) return response.json()
      })
      setFiles(files)
      return
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    refresh()
  }, [moduleSelected])

  const dragCounter = useRef(0)

  const stop = (e: MouseEvent) => {
    e.preventDefault()
  }
  const onDrag = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current++

    if (dragCounter.current === 1) {
      setOverlay(OverlayState.upload)
    }
  }
  const onDragStop = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    dragCounter.current--
    if (dragCounter.current === 0) {
      setOverlay(OverlayState.hidden)
    }
  }

  const upload = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()

    dragCounter.current = 0
    setOverlay(OverlayState.hidden)
    if (e.dataTransfer.files[0])
      API.upload('', e.dataTransfer?.files[0] as FileList[0]).then(() =>
        refresh()
      )
  }

  return (
    <>
      <Overlay />
      <div
        className={style.filesWindow}
        onMouseUp={() => setMenuState(MenuState.closed)}
        onDragOver={stop}
        onDrop={upload}
        onDragEnter={onDrag}
        onDragLeave={onDragStop}
      >
        <div
          className={`${style.uiContainer} ${
            overlay === OverlayState.upload && style.draggingg
          }`}
        >
          <h1>
            <img
              className={style.folderBlack}
              src={searchedFiles ? searchIcon : folderBlackIcon}
              alt="shared file icon"
            />
            <div>{title}</div>
          </h1>
          <FilesButtonsUI />
        </div>
        <div
          className={`${style.files} ${
            overlay === OverlayState.upload && style.draggingg
          }`}
          onContextMenu={stop}
          onMouseUp={(e) => fileClick(e, 'background')}
        >
          {currentFiles
            ? currentFiles.map((file: any, i: number) => {
              return <File name={file.name} type={file.type} key={i} />
            })
            : 'Loading files, please wait...'}
        </div>
      </div>
    </>
  )
}

export default Files

import { DragEvent, useEffect, MouseEvent, useMemo, useRef } from 'react'
import API from '@/scripts/API.js'
import File from '../../components/File/File'
import style from './Files.module.css'
import { MenuState, OverlayState, useStore } from '@/hooks/store'
import Overlay from '../../components/Overlay/Overlay'
import useFileClick from '@/hooks/useFileClick'
import FilesHeader from '@/components/FilesHeader/FilesHeader'
import { routes, useCurrentRoute } from '@/router/router'

const Files = () => {
  const {
    setMenuState,
    username,
    files,
    setFiles,
    searchedFiles,
    setOverlay,
    overlay
  } = useStore()
  const fileClick = useFileClick()

  const currentFiles = useMemo(
    () => searchedFiles || files,
    [files?.length, searchedFiles?.length]
  )

  const currentRoute = useCurrentRoute()

  const refresh = async () => {
    let apiCall
    switch (currentRoute) {
      case routes.app:
        apiCall = API.listFiles
        break
      case routes.shared:
        apiCall = API.myLinks
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
  }, [])

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
        <FilesHeader title={username} />
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

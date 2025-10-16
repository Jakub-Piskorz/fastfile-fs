import { DragEvent, useEffect, MouseEvent, useMemo, useRef } from 'react'
import API, { useListFilesApiCall } from '@/scripts/API.js'
import File from '../../../components/File/File'
import style from './Files.module.css'
import { useStore } from '@/hooks/store'
import Overlay from '../../../components/Overlay/Overlay'
import FilesHeader from '@/components/FilesHeader/FilesHeader'
import { routes, useCurrentRoute } from '@/router/router'
import useUuid from '@/hooks/useUuid'
import FileDTO from '@/types/FileDTO'
import OverlayState from '@/types/OverlayStateEnum'
import MenuState from '@/types/MenuStateEnum'

const Files = () => {
  const {
    setMenuState,
    files,
    setFiles,
    searchedFiles,
    setOverlay,
    username,
    setSearchedFiles
  } = useStore()
  const currentRoute = useCurrentRoute()


  const apiCall = useListFilesApiCall()

  const uuid = useUuid()

  const currentFiles = useMemo(
    () => {
      if (searchedFiles && searchedFiles.length > 0) {
        return searchedFiles
      }
      return files
    },
    [files?.length, searchedFiles?.length]
  )

  const title = useMemo(() => {
    if (currentRoute === routes.app) return username
    if (currentRoute === routes.shared) return 'Shared files'
    if (currentRoute === routes.link) return 'File for download'
    return username || ''

  }, [currentRoute, username])

  const refresh = async () => {
    setSearchedFiles([])
    setFiles([])

    try {
      let files: FileDTO[] = await apiCall(uuid).then((response) => {
        if (response.ok) return response.json()
      })
      if (!Array.isArray(files)) {
        files = [files]
      }
      setFiles(files)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    refresh()
  }, [currentRoute])

  const dragCounter = useRef(0)

  const stop = (e: MouseEvent) => {
    e.preventDefault()
  }
  const onDrag = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentRoute !== routes.app) {
      return
    }

    dragCounter.current++

    if (dragCounter.current === 1) {
      setOverlay(OverlayState.upload)
    }
  }
  const onDragStop = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (currentRoute !== routes.app) {
      return
    }

    dragCounter.current--
    if (dragCounter.current === 0) {
      setOverlay(OverlayState.hidden)
    }
  }

  const upload = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (currentRoute !== routes.app) {
      return
    }

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
        <FilesHeader title={title || ''} />
        <div
          className={style.files}
          onContextMenu={stop}
        >
          {currentFiles
            && currentFiles.map((fileDTO, i: number) => {
              return <File {...fileDTO} key={i} />
            })}
        </div>
      </div>
    </>
  )
}

export default Files

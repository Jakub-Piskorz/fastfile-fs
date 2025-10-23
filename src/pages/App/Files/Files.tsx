import { DragEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
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
import useFileClick from '@/hooks/useFileClick'
import { useLocation } from 'react-router-dom'

const Files = () => {
  const {
    files,
    setFiles,
    searchedFiles,
    setOverlay,
    username,
    setSearchedFiles
  } = useStore()

  const currentRoute = useCurrentRoute()
  const location = useLocation()
  const fileClick = useFileClick()
  const apiCall = useListFilesApiCall()
  const uuid = useUuid()

  const currentFiles = useMemo(
    () => {
      if (searchedFiles && searchedFiles.length > 0) {
        return searchedFiles
      }
      return files
    },
    [files, searchedFiles]
  )

  const goBackDTO: FileDTO = useMemo(() => {
    const splitPath = location.pathname.split('/')
    splitPath.pop()
    const parentDirectory = splitPath.join('/')
    const dto: FileDTO = {
      metadata: {
        name: '..',
        path: '/files' + parentDirectory,
        type: 'directory'
      }
    }
    return dto
  }, [location.pathname])

  const title = useMemo(() => {
    let currentDirectory = location.pathname
    if (currentDirectory === '/') currentDirectory = ''
    if (currentRoute === routes.app) return (username + currentDirectory)
    if (currentRoute === routes.shared) return 'Shared files'
    if (currentRoute === routes.download) return 'File for download'
    if (currentRoute === routes.sharedWithMe) return 'Shared with me'
    return (username + currentDirectory) || ''

  }, [location.pathname, username])

  const refresh = async () => {
    setSearchedFiles([])
    setFiles([])

    try {
      const parameter = uuid || location.pathname.slice(1)
      let files: FileDTO[] = await apiCall(parameter).then((response) => {
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
  }, [location.pathname])

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

  const onUpload = (e: DragEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (currentRoute !== routes.app) {
      return
    }

    dragCounter.current = 0
    setOverlay(OverlayState.hidden)
    if (e.dataTransfer.files[0])
      API.upload(location.pathname.slice(1), e.dataTransfer?.files[0] as FileList[0]).then(() =>
        refresh()
      )
  }

  const onContextMenu = (e: MouseEvent) => {
    e.stopPropagation()
    fileClick(e)
  }

  const isNestedDirectory = useMemo(() => {
    if (currentRoute !== routes.app) return false
    const splitDir = location.pathname.split('/')
    if (splitDir.length < 2) return false
    return splitDir[splitDir.length - 1] !== ''

  }, [location.pathname])

  return (
    <>
      <Overlay />
      <div
        className={style.filesWindow}
        onMouseUp={onContextMenu}
        onDragOver={stop}
        onDrop={onUpload}
        onDragEnter={onDrag}
        onDragLeave={onDragStop}
      >
        <FilesHeader title={title || ''} />
        <div
          className={style.files}
          onContextMenu={stop}
        >
          {isNestedDirectory && <File {...goBackDTO} />}
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

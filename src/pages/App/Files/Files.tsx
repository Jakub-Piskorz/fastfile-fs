import { DragEvent, MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react'
import Api, {
  useListFilesApiCall
} from '@/api'
import File from '../../../components/File/File'
import style from './Files.module.css'
import { useStore } from '@/hooks/store'
import Overlay from '../../../components/Overlay/Overlay'
import FilesHeader from '@/components/FilesHeader/FilesHeader'
import { routes, useCurrentRoute } from '@/router/router'
import useUuid from '@/hooks/useUuid'
import { FileDTO } from '@/api/Api'
import OverlayState from '@/components/Overlay/OverlayStateEnum'
import useFileClick from '@/hooks/useFileClick'
import { useLocation } from 'react-router-dom'
import GoBackFile from '@/components/File/GoBackFile'
import { useOverlayStore } from '@/components/Overlay/overlayStore'
import { joinPaths, normalizeFiles } from '@/scripts/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'


const Files = () => {
  const {
    files,
    setFiles,
    searchedFiles,
    setSelectedFiles,
    username,
    setSearchedFiles
  } = useStore()
  const { setOverlay } = useOverlayStore()

  const queryClient = useQueryClient()
  const currentRoute = useCurrentRoute()
  const location = useLocation()
  const path = location.pathname.slice(1)
  const fileClick = useFileClick()
  const apiCall = useListFilesApiCall()
  const uuid = useUuid()

  const apiCallParam = useMemo(() => uuid || path, [uuid, path])

  const getFiles = useCallback(async () => {
    const response = await apiCall(apiCallParam)
    let resFiles: FileDTO[] = []
    if (response.status === 200) {
      resFiles = normalizeFiles(response.data)
      setFiles(resFiles)
    }
    return resFiles
  }, [apiCallParam])

  const currentFiles = searchedFiles || files

  const parentDir = useMemo(() => {
    const splitPath = location.pathname.split('/')
    splitPath.pop()
    return splitPath.join('/')
  }, [location.pathname])

  const title = useMemo(() => {
    let currentDirectory = location.pathname
    if (currentDirectory === '/') currentDirectory = ''
    if (currentRoute === routes.app) return username + currentDirectory
    if (currentRoute === routes.shared) return 'Shared files'
    if (currentRoute === routes.download) return 'File for download'
    if (currentRoute === routes.sharedWithMe) return 'Shared with me'
    return username + currentDirectory || ''
  }, [location.pathname, username])

  const refresh = async () => {
    setSearchedFiles(null)
    setFiles([])
    setSelectedFiles([])
    await queryClient.invalidateQueries({ queryKey: ['files'] })
  }

  useQuery({ queryKey: ['files'], queryFn: getFiles })

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
      Api.api.uploadFile({
          filePath: '/' + joinPaths(location.pathname.slice(1)),
          file: e.dataTransfer.files[0]
        }
      ).then(() => refresh())
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
        <div className={style.files} onContextMenu={stop}>
          {isNestedDirectory && <GoBackFile path={parentDir} />}
          {currentFiles &&
            currentFiles.map((fileDTO, i: number) => {
              return <File {...fileDTO} key={i} />
            })}
        </div>
      </div>
    </>
  )
}

export default Files

import { DragEvent, MouseEvent, useMemo, useRef } from 'react'
import Api from '@/api'
import File from '../../../components/File/File'
import style from './Files.module.css'
import Overlay from '../../../components/Overlay/Overlay'
import FilesHeader from '@/components/FilesHeader/FilesHeader'
import { Routes, useCurrentRoute } from '@/router/router'
import OverlayState from '@/components/Overlay/OverlayStateEnum'
import useFileClick from '@/hooks/useFileClick'
import { useLocation } from 'react-router-dom'
import GoBackFile from '@/components/File/GoBackFile'
import { useOverlayStore } from '@/components/Overlay/overlayStore'
import { joinPaths, normalizeFiles } from '@/scripts/utils'
import { useQueryClient } from '@tanstack/react-query'
import { useFilesQuery, useTitle } from '@/pages/App/Files/filesStore'
import SkeletonFiles from '@/pages/App/Files/SkeletonFiles/SkeletonFiles'


const Files = () => {
  const { setOverlay } = useOverlayStore()

  const queryClient = useQueryClient()
  const currentRoute = useCurrentRoute()
  const location = useLocation()
  const fileClick = useFileClick()

  const title = useTitle()

  const parentDir = useMemo(() => {
    const splitPath = location.pathname.split('/')
    splitPath.pop()
    return splitPath.join('/')
  }, [location.pathname])

  const { data, isLoading } = useFilesQuery()
  const files = useMemo(
    () => normalizeFiles(data?.data),
    [data]
  )

  const dragCounter = useRef(0)

  const stop = (e: MouseEvent) => {
    e.preventDefault()
  }
  const onDrag = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (currentRoute !== Routes.app) {
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

    if (currentRoute !== Routes.app) {
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

    if (currentRoute !== Routes.app) {
      return
    }

    dragCounter.current = 0
    setOverlay(OverlayState.hidden)
    const filePath = decodeURIComponent('/' + joinPaths(location.pathname.slice(1)))
    if (e.dataTransfer.files[0])
      Api.api.uploadFile({
          filePath,
          file: e.dataTransfer.files[0]
        }
      ).then(() => queryClient.invalidateQueries({ queryKey: ['files'] }))
  }

  const onContextMenu = (e: MouseEvent) => {
    e.stopPropagation()
    fileClick(e)
  }

  const isNestedDirectory = useMemo(() => {
    if (currentRoute !== Routes.app) return false
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
          {files &&
            files.map((fileDTO, i: number) => {
              return <File {...fileDTO} key={i} />
            })}
          {isLoading && <SkeletonFiles />}
        </div>
      </div>
    </>
  )
}

export default Files

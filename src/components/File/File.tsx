import pdfIcon from '@/images/pdf.svg'
import jpgIcon from '@/images/jpg.svg'
import mp3Icon from '@/images/mp3.svg'
import fileIcon from '@/images/file.svg'
import psdIcon from '@/images/psd.svg'
import folderFileIcon from '@/images/folder-file.svg'
import style from './File.module.css'
import React, { MouseEvent, useMemo } from 'react'
import { useStore } from '@/hooks/store'
import useFileClick from '@/hooks/useFileClick'
import { FileDTO } from '@/api/Api'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/router/router'
import { simplifyPath } from '@/scripts/utils'

const File = ({ metadata, fileLink }: FileDTO) => {
  const { selectedFiles, setSelectedFiles } = useStore()
  const navigate = useNavigate()
  const fileClick = useFileClick()

  const icon = useMemo(() => {
    if (metadata!.type === 'directory') return folderFileIcon
    const splitName = metadata!.name!.split('.')
    if (splitName.length < 2) return fileIcon
    const fileFormat = splitName[splitName.length - 1]
    switch (true) {
      case ['jpg', 'jpeg', 'png'].includes(fileFormat):
        return jpgIcon
      case ['pdf'].includes(fileFormat):
        return pdfIcon
      case ['mp3', 'mp4', 'mpeg4'].includes(fileFormat):
        return mp3Icon
      case ['psd'].includes(fileFormat):
        return psdIcon
      default:
        return fileIcon
    }
  }, [metadata!.name])

  const selectFile = (event: React.MouseEvent) => {
    if (!event || setSelectedFiles === undefined) return
    event.stopPropagation()
    event.preventDefault()
    const target = event.target as HTMLElement
    const currentTarget = event.currentTarget as HTMLElement
    // Did user click the select button?
    if (
      target.classList[0] === style.checkmark ||
      target.classList[0] === style.mark
    ) {
      // Is file selected?
      if (currentTarget.classList.contains(style.selected)) {
        // Unselect file.
        setSelectedFiles(selectedFiles.filter((item) => item.metadata!.name !== metadata!.name))
      } else {
        // Select file.
        setSelectedFiles([...selectedFiles, { metadata, fileLink }])
      }
    }
  }

  const onDoubleClick = () => {
    if (metadata!.type !== 'directory') return
    const path = simplifyPath(metadata.path!)
    navigate(routes.app + path)
  }

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div
      className={
        style.file + (selectedFiles.some(file => file.metadata.name === metadata.name) ? ` ${style.selected}` : '')
      }
      onContextMenu={stop}
      onClick={selectFile}
      onMouseUp={(e: MouseEvent) => {
        fileClick(e, { metadata, fileLink })
      }}
      onDoubleClick={onDoubleClick}
    >
      <img src={icon} draggable="false" alt={metadata.name + ' icon'} />
      <p>{metadata.name}</p>
      <div className={style.checkmark}>
        <span className={style.mark}>✔</span>
      </div>
    </div>
  )
}

export default File

import pdfIcon from '@/images/pdf.svg'
import jpgIcon from '@/images/jpg.svg'
import mp3Icon from '@/images/mp3.svg'
import fileIcon from '@/images/file.svg'
import psdIcon from '@/images/psd.svg'
import folderIcon from '@/images/folder-black.svg'
import style from './File.module.scss'
import React, { MouseEvent, useEffect, useMemo } from 'react'
import { useStore } from '@/hooks/store'

interface FileProps {
  name: string
  type: 'file' | 'directory'
  onMouseUp: (...args: any) => any
  onDragOver: any
}

const File = ({
  onDragOver,
  name = '',
  type,
  onMouseUp: mouseUp = (...args: any) => {
    console.error('error: mouseUp function not found')
  },
}: FileProps) => {
  const { selectedItems, setSelectedItems } = useStore()

  const icon = useMemo(() => {
    if (type === 'directory') {
      return folderIcon
    }
    const splitName = name.split('.')
    if (splitName.length < 2) return
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
  }, [name])

  const selectFile = (event: React.MouseEvent) => {
    if (!event || setSelectedItems === undefined) return
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
        setSelectedItems(selectedItems.filter((item) => item !== name))
      } else {
        // Select file.
        setSelectedItems([...selectedItems, name])
      }
    }
  }

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div
      className={
        style.file + (selectedItems.includes(name) ? ` ${style.selected}` : '')
      }
      onContextMenu={stop}
      onClick={selectFile}
      onDragOver={stop}
      onDragEnter={stop}
      onDragLeave={stop}
      onMouseUp={(e: MouseEvent) => {
        mouseUp(e, name)
      }}
    >
      <img src={icon} draggable="false" />
      <p>{name}</p>
      <div className={style.checkmark}>
        <span className={style.mark}>✔</span>
      </div>
    </div>
  )
}

export default File
